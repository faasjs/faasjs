import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { detectNodeRuntime, loadPackage, resetRuntime } from '../load_package'

const execFileAsync = promisify(execFile)
const loadPackageModuleURL = new URL('../load_package.ts', import.meta.url).href

async function runNativeLoadPackage(root: string, script: string): Promise<string> {
  const { stdout } = await execFileAsync(process.execPath, ['--input-type=module', '-e', script], {
    env: {
      ...process.env,
      FAAS_TEST_ROOT: root,
      FAAS_LOAD_PACKAGE_MODULE_URL: loadPackageModuleURL,
    },
  })

  return stdout.trim()
}

describe('loadPackage', () => {
  let originalRequire: any
  let originalProcess: any

  beforeEach(() => {
    originalRequire = globalThis.require
    originalProcess = globalThis.process
    vi.resetModules()
    resetRuntime()
  })

  afterEach(() => {
    globalThis.require = originalRequire
    globalThis.process = originalProcess
    resetRuntime()
  })

  it('should load a module', async () => {
    // @ts-expect-error
    globalThis.require = vi.fn().mockImplementation((name: string) => {
      if (name === 'my-module') return { default: 'my-module-default' }
    })
    const result = await loadPackage('my-module')
    expect(result).toBe('my-module-default')
  })

  it('should load a module with default name', async () => {
    // @ts-expect-error
    globalThis.require = vi.fn().mockImplementation((name: string) => {
      if (name === 'my-module') return { test: 'my-module-default' }
    })
    const result = await loadPackage('my-module', 'test')
    expect(result).toBe('my-module-default')
  })

  it('should load a module with default name list', async () => {
    // @ts-expect-error
    globalThis.require = vi.fn().mockImplementation((name: string) => {
      if (name === 'my-module') return { test: 'my-module-default' }
    })
    const result = await loadPackage('my-module', ['default', 'test'])
    expect(result).toBe('my-module-default')
  })

  it('should load esm module when require is unavailable', async () => {
    // @ts-expect-error
    globalThis.require = undefined

    const path = await import('node:path')
    const result = await loadPackage<string>('node:path', 'sep')

    expect(result).toBe(path.sep)
  })

  it('should fallback to module object when default export key is missing', async () => {
    // @ts-expect-error
    globalThis.require = vi.fn().mockImplementation((name: string) => {
      if (name === 'my-module') return { key: 'value' }
    })

    const result = await loadPackage('my-module', 'default')

    expect(result).toEqual({ key: 'value' })
  })

  it('should fallback to module object when default names are all missing', async () => {
    // @ts-expect-error
    globalThis.require = vi.fn().mockImplementation((name: string) => {
      if (name === 'my-module') return { key: 'value' }
    })

    const result = await loadPackage('my-module', ['default', 'test'])

    expect(result).toEqual({ key: 'value' })
  })

  it('should reuse cached runtime', () => {
    // @ts-expect-error
    globalThis.require = vi.fn()

    expect(detectNodeRuntime()).toBe('commonjs')

    // @ts-expect-error
    globalThis.require = undefined
    // @ts-expect-error
    globalThis.process = undefined

    expect(detectNodeRuntime()).toBe('commonjs')
  })

  it('should throw when runtime cannot be detected', () => {
    // @ts-expect-error
    globalThis.require = undefined
    // @ts-expect-error
    globalThis.process = undefined

    expect(() => detectNodeRuntime()).toThrow('Unknown runtime')
  })
})

describe('loadPackage tsconfig resolver', () => {
  let originalRequire: any
  const tempDirs: string[] = []

  beforeEach(() => {
    originalRequire = globalThis.require
    // @ts-expect-error
    globalThis.require = undefined
    resetRuntime()
  })

  afterEach(async () => {
    globalThis.require = originalRequire
    resetRuntime()

    await Promise.all(
      tempDirs.splice(0).map((path) =>
        rm(path, {
          recursive: true,
          force: true,
        }),
      ),
    )
  })

  it('should resolve tsconfig paths and reload with version token', async () => {
    const root = await mkdtemp(join(tmpdir(), 'faas-load-package-'))
    tempDirs.push(root)

    await mkdir(join(root, 'src', 'shared'), {
      recursive: true,
    })

    await writeFile(
      join(root, 'tsconfig.json'),
      JSON.stringify(
        {
          compilerOptions: {
            baseUrl: '.',
            paths: {
              '@/*': ['src/*'],
            },
          },
        },
        null,
        2,
      ),
      'utf8',
    )

    await writeFile(join(root, 'src', 'shared', 'message.ts'), `export const message = 'v1'\n`, 'utf8')
    await writeFile(
      join(root, 'src', 'entry.func.ts'),
      `import { message } from '@/shared/message'

export const func = {
  export() {
    return {
      handler: async () => message,
    }
  },
}
`,
      'utf8',
    )

    const output = await runNativeLoadPackage(
      root,
      `
import { join } from 'node:path'
import { writeFileSync } from 'node:fs'

const root = process.env.FAAS_TEST_ROOT
const moduleUrl = process.env.FAAS_LOAD_PACKAGE_MODULE_URL
const { loadPackage, resetRuntime } = await import(moduleUrl)

resetRuntime()

const entry = join(root, 'src', 'entry.func.ts')
const first = await loadPackage(entry, ['func'], { root, version: '1' })
const firstValue = await first.export().handler()

writeFileSync(join(root, 'src', 'shared', 'message.ts'), "export const message = 'v2'\\n", 'utf8')

const second = await loadPackage(entry, ['func'], { root, version: '2' })
const secondValue = await second.export().handler()

process.stdout.write(JSON.stringify({ firstValue, secondValue }))
`,
    )

    expect(JSON.parse(output)).toEqual({
      firstValue: 'v1',
      secondValue: 'v2',
    })
  })

  it('should resolve extensionless relative imports', async () => {
    const root = await mkdtemp(join(tmpdir(), 'faas-load-package-relative-'))
    tempDirs.push(root)

    await mkdir(join(root, 'src'), {
      recursive: true,
    })

    await writeFile(join(root, 'src', 'message.ts'), `export const message = 'ok'\n`, 'utf8')
    await writeFile(
      join(root, 'src', 'entry.func.ts'),
      `import { message } from './message'

export const func = {
  export() {
    return {
      handler: async () => message,
    }
  },
}
`,
      'utf8',
    )

    const output = await runNativeLoadPackage(
      root,
      `
import { join } from 'node:path'

const root = process.env.FAAS_TEST_ROOT
const moduleUrl = process.env.FAAS_LOAD_PACKAGE_MODULE_URL
const { loadPackage, resetRuntime } = await import(moduleUrl)

resetRuntime()

const loaded = await loadPackage(join(root, 'src', 'entry.func.ts'), ['func'], {
  root,
  version: '3',
})

const value = await loaded.export().handler()
process.stdout.write(String(value))
`,
    )

    expect(output).toBe('ok')
  })
})
