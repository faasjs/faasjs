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

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('faas lint cli', () => {
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
})
