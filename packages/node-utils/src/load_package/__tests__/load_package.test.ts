import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { detectNodeRuntime, loadPackage, resetRuntime } from '../../load_package'

const execFileAsync = promisify(execFile)
const loadPackageModuleURL = new URL('../index.ts', import.meta.url).href
function createDataModuleURL(source: string): string {
  return `data:text/javascript,${encodeURIComponent(source)}`
}

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

async function runNodeWithPreload(
  root: string,
  preloadSource: string,
  entry: string,
): Promise<string> {
  const preloadPath = join(root, 'preload-loader.mjs')

  await writeFile(preloadPath, preloadSource, 'utf8')

  const { stdout } = await execFileAsync(process.execPath, ['--import', preloadPath, entry], {
    cwd: root,
    env: {
      ...process.env,
    },
  })

  return stdout.trim()
}

async function runNodeWithRegisterHooks(
  root: string,
  entry: string,
  runtimeEntry: string = entry,
): Promise<string> {
  return runNodeWithPreload(
    root,
    `import { registerNodeModuleHooks } from ${JSON.stringify(loadPackageModuleURL)}

registerNodeModuleHooks({
  entry: ${JSON.stringify(entry)},
})
`,
    runtimeEntry,
  )
}

async function runNodeWithRegisterHooksTsconfig(root: string, entry: string): Promise<string> {
  return runNodeWithPreload(
    root,
    `import { join } from 'node:path'
import { registerNodeModuleHooks } from ${JSON.stringify(loadPackageModuleURL)}

registerNodeModuleHooks({
  tsconfigPath: join(${JSON.stringify(root)}, 'tsconfig.json'),
})
`,
    entry,
  )
}

describe('loadPackage', () => {
  let originalProcess: any

  beforeEach(() => {
    originalProcess = globalThis.process
    vi.resetModules()
    resetRuntime()
  })

  afterEach(() => {
    globalThis.process = originalProcess
    resetRuntime()
  })

  it('should load a module', async () => {
    const result = await loadPackage<string>(
      createDataModuleURL(`export default 'my-module-default'`),
    )

    expect(result).toBe('my-module-default')
  })

  it('should load a module with default name', async () => {
    const result = await loadPackage<string>(
      createDataModuleURL(`export const test = 'my-module-default'`),
      'test',
    )

    expect(result).toBe('my-module-default')
  })

  it('should load a module with default name list', async () => {
    const result = await loadPackage<string>(
      createDataModuleURL(`export const test = 'my-module-default'`),
      ['default', 'test'],
    )

    expect(result).toBe('my-module-default')
  })

  it('should load esm module in module runtime', async () => {
    const path = await import('node:path')
    const result = await loadPackage<string>('node:path', 'sep')

    expect(result).toBe(path.sep)
  })

  it('should fallback to module object when default export key is missing', async () => {
    const result = await loadPackage(createDataModuleURL(`export const key = 'value'`), 'default')

    expect(result).toMatchObject({ key: 'value' })
  })

  it('should fallback to module object when default names are all missing', async () => {
    const result = await loadPackage(createDataModuleURL(`export const key = 'value'`), [
      'default',
      'test',
    ])

    expect(result).toMatchObject({ key: 'value' })
  })

  it('should reuse cached runtime', () => {
    expect(detectNodeRuntime()).toBe('module')
    // @ts-expect-error
    globalThis.process = undefined

    expect(detectNodeRuntime()).toBe('module')
  })

  it('should throw when runtime cannot be detected', () => {
    // @ts-expect-error
    globalThis.process = undefined

    expect(() => detectNodeRuntime()).toThrow('Unknown runtime')
  })
})

describe('loadPackage tsconfig resolver', () => {
  const tempDirs: string[] = []

  beforeEach(() => {
    resetRuntime()
  })

  afterEach(async () => {
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

    await writeFile(
      join(root, 'src', 'shared', 'message.ts'),
      `export const message = 'v1'\n`,
      'utf8',
    )
    await writeFile(
      join(root, 'src', 'entry.api.ts'),
      `import { message } from '@/shared/message'

export default {
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

const entry = join(root, 'src', 'entry.api.ts')
const first = await loadPackage(entry, 'default', { root, version: '1' })
const firstValue = await first.export().handler()

writeFileSync(join(root, 'src', 'shared', 'message.ts'), "export const message = 'v2'\\n", 'utf8')

const second = await loadPackage(entry, 'default', { root, version: '2' })
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
      join(root, 'src', 'entry.api.ts'),
      `import { message } from './message'

export default {
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

const loaded = await loadPackage(join(root, 'src', 'entry.api.ts'), 'default', {
  root,
  version: '3',
})

const value = await loaded.export().handler()
process.stdout.write(String(value))
`,
    )

    expect(output).toBe('ok')
  })

  it('should resolve relative imports with existing suffix via .ts fallback', async () => {
    const root = await mkdtemp(join(tmpdir(), 'faas-load-package-suffix-'))
    tempDirs.push(root)

    await mkdir(join(root, 'src'), {
      recursive: true,
    })

    await writeFile(
      join(root, 'src', 'message.json.ts'),
      `export const message = 'json-ts'\n`,
      'utf8',
    )
    await writeFile(
      join(root, 'src', 'entry.api.ts'),
      `import { message } from './message.json'

export default {
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

const loaded = await loadPackage(join(root, 'src', 'entry.api.ts'), 'default', {
  root,
  version: '4',
})

const value = await loaded.export().handler()
process.stdout.write(String(value))
`,
    )

    expect(output).toBe('json-ts')
  })

  it('should prefer an exact relative import match over .ts fallback', async () => {
    const root = await mkdtemp(join(tmpdir(), 'faas-load-package-exact-'))
    tempDirs.push(root)

    await mkdir(join(root, 'src'), {
      recursive: true,
    })

    await writeFile(join(root, 'src', 'message.js'), `export const message = 'exact'\n`, 'utf8')
    await writeFile(
      join(root, 'src', 'message.js.ts'),
      `export const message = 'fallback'\n`,
      'utf8',
    )
    await writeFile(
      join(root, 'src', 'entry.api.ts'),
      `import { message } from './message.js'

export default {
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

const loaded = await loadPackage(join(root, 'src', 'entry.api.ts'), 'default', {
  root,
  version: '5',
})

const value = await loaded.export().handler()
process.stdout.write(String(value))
`,
    )

    expect(output).toBe('exact')
  })

  it('should discover commented tsconfig rules from a file URL entry', async () => {
    const root = await mkdtemp(join(tmpdir(), 'faas-load-package-file-url-'))
    tempDirs.push(root)

    await mkdir(join(root, 'src', 'lib', 'message'), {
      recursive: true,
    })
    await mkdir(join(root, 'src', 'nested'), {
      recursive: true,
    })

    await writeFile(
      join(root, 'tsconfig.json'),
      `{
  // keep comments and trailing commas legal for the loader parser
  "compilerOptions": {
    /* baseUrl should resolve relative to this tsconfig */
    "baseUrl": "./src",
    "paths": {
      "@shared/*": ["lib/*",],
      "@exact": ["lib/exact.ts",],
      "@ignored": "lib/ignored.ts",
      "@skip**": ["lib/ignored.ts"],
      "@empty/*": [null, "   ",],
    },
  },
}
`,
      'utf8',
    )
    await writeFile(
      join(root, 'src', 'lib', 'message', 'index.ts'),
      `export const message = 'dir'\n`,
      'utf8',
    )
    await writeFile(join(root, 'src', 'lib', 'exact.ts'), `export const exact = 'exact'\n`, 'utf8')
    await writeFile(
      join(root, 'src', 'nested', 'entry.api.ts'),
      `import { exact } from '@exact'
import { message } from '@shared/message'

export default {
  export() {
    return {
      handler: async () => \`\${message}:\${exact}\`,
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
import { pathToFileURL } from 'node:url'

const root = process.env.FAAS_TEST_ROOT
const moduleUrl = process.env.FAAS_LOAD_PACKAGE_MODULE_URL
const { loadPackage, resetRuntime } = await import(moduleUrl)

resetRuntime()

const entry = pathToFileURL(join(root, 'src', 'nested', 'entry.api.ts')).href
const loaded = await loadPackage(entry, 'default', {
  version: '6',
})

const value = await loaded.export().handler()
process.stdout.write(String(value))
`,
    )

    expect(output).toBe('dir:exact')
  })
})

describe('register_hooks preload', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(
      tempDirs.splice(0).map((path) =>
        rm(path, {
          recursive: true,
          force: true,
        }),
      ),
    )
  })

  it('should resolve extensionless imports via node --import', async () => {
    const root = await mkdtemp(join(tmpdir(), 'faas-loader-preload-relative-'))
    tempDirs.push(root)

    await mkdir(join(root, 'src'), {
      recursive: true,
    })

    await writeFile(join(root, 'src', 'message.ts'), "export const message = 'ok'\n", 'utf8')
    await writeFile(
      join(root, 'server.ts'),
      `import { message } from './src/message'

process.stdout.write(message)
`,
      'utf8',
    )

    const output = await runNodeWithRegisterHooks(root, join(root, 'server.ts'))

    expect(output).toBe('ok')
  })

  it('should resolve existing-suffix imports via .ts fallback with node --import', async () => {
    const root = await mkdtemp(join(tmpdir(), 'faas-loader-preload-suffix-'))
    tempDirs.push(root)

    await mkdir(join(root, 'src'), {
      recursive: true,
    })

    await writeFile(join(root, 'src', 'message.json.ts'), "export const message = 'ok'\n", 'utf8')
    await writeFile(
      join(root, 'server.ts'),
      `import { message } from './src/message.json'

process.stdout.write(message)
`,
      'utf8',
    )

    const output = await runNodeWithRegisterHooks(root, join(root, 'server.ts'))

    expect(output).toBe('ok')
  })

  it('should resolve tsconfig paths via node --import', async () => {
    const root = await mkdtemp(join(tmpdir(), 'faas-loader-preload-tsconfig-'))
    tempDirs.push(root)

    await mkdir(join(root, 'src'), {
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

    await writeFile(join(root, 'src', 'message.ts'), "export const message = 'ok'\n", 'utf8')
    await writeFile(
      join(root, 'server.ts'),
      `import { message } from '@/message'

process.stdout.write(message)
`,
      'utf8',
    )

    const output = await runNodeWithRegisterHooks(root, join(root, 'server.ts'))

    expect(output).toBe('ok')
  })

  it('should resolve tsconfig paths when only tsconfigPath is provided', async () => {
    const root = await mkdtemp(join(tmpdir(), 'faas-loader-preload-tsconfig-path-'))
    tempDirs.push(root)

    await mkdir(join(root, 'src'), {
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
    await writeFile(join(root, 'src', 'message.ts'), "export const message = 'ok'\n", 'utf8')
    await writeFile(
      join(root, 'server.ts'),
      `import { message } from '@/message'

process.stdout.write(message)
`,
      'utf8',
    )

    const output = await runNodeWithRegisterHooksTsconfig(root, join(root, 'server.ts'))

    expect(output).toBe('ok')
  })

  it('should accept a file URL entry when preloading registerNodeModuleHooks', async () => {
    const root = await mkdtemp(join(tmpdir(), 'faas-loader-preload-file-url-'))
    tempDirs.push(root)

    await mkdir(join(root, 'src', 'message'), {
      recursive: true,
    })

    await writeFile(
      join(root, 'src', 'message', 'index.ts'),
      "export const message = 'ok'\n",
      'utf8',
    )
    await writeFile(
      join(root, 'server.ts'),
      `import { message } from './src/message'

process.stdout.write(message)
`,
      'utf8',
    )

    const output = await runNodeWithRegisterHooks(
      root,
      pathToFileURL(join(root, 'server.ts')).href,
      join(root, 'server.ts'),
    )

    expect(output).toBe('ok')
  })
})
