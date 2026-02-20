import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const execFileSync = vi.fn(() => undefined)
  const existsSync = vi.fn(
    (path: string) =>
      path === '/tooling/oxfmt/package.json' ||
      path === '/tooling/oxlint/package.json' ||
      path === '/tooling/faasjs-dev/package.json' ||
      path === '/tooling/faasjs-dev/configs/oxfmt.base.json' ||
      path === '/tooling/faasjs-dev/configs/oxlint.base.json',
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

    return '{}'
  })
  const resolve = vi.fn((name: string) => {
    if (name === 'oxfmt') return '/tooling/oxfmt/dist/index.js'
    if (name === 'oxlint') return '/tooling/oxlint/dist/index.js'
    if (name === '@faasjs/dev') return '/tooling/faasjs-dev/dist/index.js'

    throw Error(`Unknown module: ${name}`)
  })

  return {
    execFileSync,
    existsSync,
    readFileSync,
    resolve,
  }
})

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
  mocks.existsSync.mockImplementation(
    (path: string) =>
      path === '/tooling/oxfmt/package.json' ||
      path === '/tooling/oxlint/package.json' ||
      path === '/tooling/faasjs-dev/package.json' ||
      path === '/tooling/faasjs-dev/configs/oxfmt.base.json' ||
      path === '/tooling/faasjs-dev/configs/oxlint.base.json',
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

    return '{}'
  })
  mocks.resolve.mockImplementation((name: string) => {
    if (name === 'oxfmt') return '/tooling/oxfmt/dist/index.js'
    if (name === 'oxlint') return '/tooling/oxlint/dist/index.js'
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

  it('should run oxfmt and oxlint with fix', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'lint'])

    expect(code).toBe(0)
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
    expect(logSpy).toHaveBeenCalledWith('[faas lint] Done')
  })

  it('should pass root option to tooling commands', async () => {
    const root = '/tmp/faas-project'
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'lint', '--root', root])

    expect(code).toBe(0)
    expect(mocks.execFileSync).toHaveBeenCalledTimes(2)
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
    expect(logSpy).toHaveBeenCalledWith('[faas lint] Done')
  })

  it('should return error for unexpected argument', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'lint', 'unexpected'])

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith('[faas lint] Unexpected argument: unexpected')
  })

  it('should return error when oxfmt dependency is missing', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    mocks.resolve.mockImplementation(() => {
      throw Error('Cannot find module')
    })

    const code = await main(['node', 'faas', 'lint'])

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith(
      '[faas lint] Missing dependency: oxfmt. Please install oxfmt in your project.',
    )
  })

  it('should return error when dependency package.json cannot be found', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    mocks.existsSync.mockImplementation((path: string) => path === '/tmp/project/package.json')
    mocks.resolve.mockImplementation(() => '/tooling/oxfmt/dist/index.js')

    const code = await main(['node', 'faas', 'lint', '--root', '/tmp/project'])

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith(
      '[faas lint] Invalid dependency: Cannot find package.json for oxfmt.',
    )
  })

  it('should return error when dependency does not expose expected bin', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    mocks.readFileSync.mockImplementation(() => '{}')

    const code = await main(['node', 'faas', 'lint'])

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith(
      '[faas lint] Invalid dependency: oxfmt does not expose "oxfmt" bin.',
    )
  })

  it('should return error when oxfmt command fails', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    mocks.execFileSync.mockImplementation(() => {
      throw Error('failed')
    })

    const code = await main(['node', 'faas', 'lint'])

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith('[faas lint] oxfmt failed')
  })
})
