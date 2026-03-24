import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const execFileSync = vi.fn(() => undefined)
  const loadEnvFileIfExists = vi.fn(() => null)
  const existsSync = vi.fn(
    (path: string) =>
      path === '/tooling/oxfmt/package.json' ||
      path === '/tooling/oxlint/package.json' ||
      path === '/tooling/typescript/package.json' ||
      path === '/tooling/faasjs-dev/package.json' ||
      path === '/tooling/faasjs-dev/configs/oxfmt.base.json' ||
      path === '/tooling/faasjs-dev/configs/oxlint.base.json' ||
      path.endsWith('/tsconfig.json'),
  )
  const readFileSync = vi.fn((path: string) => {
    if (path.endsWith('/oxfmt/package.json'))
      return JSON.stringify({
        bin: {
          oxfmt: 'bin/oxfmt',
        },
      })

    if (path.endsWith('/oxlint/package.json'))
      return JSON.stringify({
        bin: {
          oxlint: 'bin/oxlint',
        },
      })

    if (path.endsWith('/typescript/package.json'))
      return JSON.stringify({
        bin: {
          tsc: 'bin/tsc',
        },
      })

    return '{}'
  })
  const resolve = vi.fn((name: string) => {
    if (name === 'oxfmt') return '/tooling/oxfmt/dist/index.js'
    if (name === 'oxlint') return '/tooling/oxlint/dist/index.js'
    if (name === 'typescript') return '/tooling/typescript/lib/typescript.js'
    if (name === '@faasjs/dev') return '/tooling/faasjs-dev/dist/index.js'

    throw Error(`Unknown module: ${name}`)
  })

  return {
    execFileSync,
    loadEnvFileIfExists,
    existsSync,
    readFileSync,
    resolve,
  }
})

vi.mock('@faasjs/node-utils', () => ({
  loadEnvFileIfExists: mocks.loadEnvFileIfExists,
}))

vi.mock('node:child_process', () => ({
  execFileSync: mocks.execFileSync,
}))

vi.mock('node:fs', () => ({
  existsSync: mocks.existsSync,
  readFileSync: mocks.readFileSync,
}))

vi.mock('node:module', () => ({
  createRequire: () => ({
    resolve: mocks.resolve,
  }),
}))

import { main } from '../index'

function resetMockImplementations(): void {
  mocks.execFileSync.mockImplementation(() => undefined)
  mocks.loadEnvFileIfExists.mockImplementation(() => null)
  mocks.existsSync.mockImplementation(
    (path: string) =>
      path === '/tooling/oxfmt/package.json' ||
      path === '/tooling/oxlint/package.json' ||
      path === '/tooling/typescript/package.json' ||
      path === '/tooling/faasjs-dev/package.json' ||
      path === '/tooling/faasjs-dev/configs/oxfmt.base.json' ||
      path === '/tooling/faasjs-dev/configs/oxlint.base.json' ||
      path.endsWith('/tsconfig.json'),
  )
  mocks.readFileSync.mockImplementation((path: string) => {
    if (path.endsWith('/oxfmt/package.json'))
      return JSON.stringify({
        bin: {
          oxfmt: 'bin/oxfmt',
        },
      })

    if (path.endsWith('/oxlint/package.json'))
      return JSON.stringify({
        bin: {
          oxlint: 'bin/oxlint',
        },
      })

    if (path.endsWith('/typescript/package.json'))
      return JSON.stringify({
        bin: {
          tsc: 'bin/tsc',
        },
      })

    return '{}'
  })
  mocks.resolve.mockImplementation((name: string) => {
    if (name === 'oxfmt') return '/tooling/oxfmt/dist/index.js'
    if (name === 'oxlint') return '/tooling/oxlint/dist/index.js'
    if (name === 'typescript') return '/tooling/typescript/lib/typescript.js'
    if (name === '@faasjs/dev') return '/tooling/faasjs-dev/dist/index.js'

    throw Error(`Unknown module: ${name}`)
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  resetMockImplementations()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('faas lint cli', () => {
  it('should print help text', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'lint', '--help'])

    expect(code).toBe(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Usage:'))
  })

  it('should print version text', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'lint', '--version'])

    expect(code).toBe(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/^v?\d+/))
  })

  it('should run oxfmt, oxlint and tsc checks', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'lint'])

    expect(code).toBe(0)
    expect(mocks.loadEnvFileIfExists).toHaveBeenCalledWith({
      cwd: process.cwd(),
    })
    expect(mocks.execFileSync).toHaveBeenNthCalledWith(
      1,
      process.execPath,
      ['/tooling/oxfmt/bin/oxfmt', '-c', '/tooling/faasjs-dev/configs/oxfmt.base.json', '.'],
      {
        cwd: process.cwd(),
        stdio: 'inherit',
      },
    )
    expect(mocks.execFileSync).toHaveBeenNthCalledWith(
      2,
      process.execPath,
      [
        '/tooling/oxlint/bin/oxlint',
        '-c',
        '/tooling/faasjs-dev/configs/oxlint.base.json',
        '--fix',
        '.',
      ],
      {
        cwd: process.cwd(),
        stdio: 'inherit',
      },
    )
    expect(mocks.execFileSync).toHaveBeenNthCalledWith(
      3,
      process.execPath,
      ['/tooling/typescript/bin/tsc', '--noEmit', '--project', `${process.cwd()}/tsconfig.json`],
      {
        cwd: process.cwd(),
        stdio: 'inherit',
      },
    )
    expect(logSpy).toHaveBeenCalledWith('[faas lint] Done')
  })

  it('should pass root option to tooling commands', async () => {
    const root = '/tmp/faas-project'
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'lint', '--root', root])

    expect(code).toBe(0)
    expect(mocks.loadEnvFileIfExists).toHaveBeenCalledWith({
      cwd: root,
    })
    expect(mocks.execFileSync).toHaveBeenCalledTimes(3)
    expect(mocks.execFileSync).toHaveBeenNthCalledWith(
      1,
      process.execPath,
      ['/tooling/oxfmt/bin/oxfmt', '-c', '/tooling/faasjs-dev/configs/oxfmt.base.json', '.'],
      {
        cwd: root,
        stdio: 'inherit',
      },
    )
    expect(mocks.execFileSync).toHaveBeenNthCalledWith(
      2,
      process.execPath,
      [
        '/tooling/oxlint/bin/oxlint',
        '-c',
        '/tooling/faasjs-dev/configs/oxlint.base.json',
        '--fix',
        '.',
      ],
      {
        cwd: root,
        stdio: 'inherit',
      },
    )
    expect(mocks.execFileSync).toHaveBeenNthCalledWith(
      3,
      process.execPath,
      ['/tooling/typescript/bin/tsc', '--noEmit', '--project', `${root}/tsconfig.json`],
      {
        cwd: root,
        stdio: 'inherit',
      },
    )
    expect(logSpy).toHaveBeenCalledWith('[faas lint] Done')
  })

  it('should return error when tsconfig is missing', async () => {
    const root = '/tmp/no-tsconfig'
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    mocks.existsSync.mockImplementation(
      (path: string) =>
        path === '/tooling/oxfmt/package.json' ||
        path === '/tooling/oxlint/package.json' ||
        path === '/tooling/typescript/package.json' ||
        path === '/tooling/faasjs-dev/package.json' ||
        path === '/tooling/faasjs-dev/configs/oxfmt.base.json' ||
        path === '/tooling/faasjs-dev/configs/oxlint.base.json',
    )

    const code = await main(['node', 'faas', 'lint', '--root', root])

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith(
      `[faas lint] Missing tsconfig.json: ${root}/tsconfig.json`,
    )
    expect(mocks.execFileSync).not.toHaveBeenCalled()
  })

  it('should return error for unexpected argument', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'lint', 'unexpected'])

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith('[faas lint] Unexpected argument: unexpected')
  })
})
