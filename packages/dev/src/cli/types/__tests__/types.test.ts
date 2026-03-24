import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  generateFaasTypes: vi.fn(),
  loadEnvFileIfExists: vi.fn(() => null),
}))

vi.mock('@faasjs/node-utils', () => ({
  loadEnvFileIfExists: mocks.loadEnvFileIfExists,
}))

vi.mock('../../../typegen', () => ({
  generateFaasTypes: mocks.generateFaasTypes,
}))

import { main } from '..'

function resetMockImplementations(): void {
  mocks.loadEnvFileIfExists.mockImplementation(() => null)
  mocks.generateFaasTypes.mockImplementation(async () => ({
    changed: true,
    fileCount: 3,
    output: '/tmp/faas-project/src/.faasjs/types.d.ts',
    routeCount: 2,
  }))
}

beforeEach(() => {
  vi.clearAllMocks()
  resetMockImplementations()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('faas types cli', () => {
  it('should print help text', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', '--help'])

    expect(code).toBe(0)
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Generate FaasJS API type declarations.'),
    )
    expect(mocks.loadEnvFileIfExists).not.toHaveBeenCalled()
    expect(mocks.generateFaasTypes).not.toHaveBeenCalled()
  })

  it('should print version text', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', '--version'])

    expect(code).toBe(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/^v?\d+/))
    expect(mocks.loadEnvFileIfExists).not.toHaveBeenCalled()
    expect(mocks.generateFaasTypes).not.toHaveBeenCalled()
  })

  it('should load env file and generate types with default root', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas'])

    expect(code).toBe(0)
    expect(mocks.loadEnvFileIfExists).toHaveBeenCalledWith({
      cwd: process.cwd(),
    })
    expect(mocks.generateFaasTypes).toHaveBeenCalledWith({})
    expect(logSpy).toHaveBeenCalledWith(
      '[faas types] Generated /tmp/faas-project/src/.faasjs/types.d.ts (2 routes from 3 files)',
    )
  })

  it('should pass root option to env loading and type generation', async () => {
    const root = '/tmp/faas-project'
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    mocks.generateFaasTypes.mockImplementation(async () => ({
      changed: false,
      fileCount: 1,
      output: `${root}/src/.faasjs/types.d.ts`,
      routeCount: 1,
    }))

    const code = await main(['node', 'faas', '--root', root])

    expect(code).toBe(0)
    expect(mocks.loadEnvFileIfExists).toHaveBeenCalledWith({
      cwd: root,
    })
    expect(mocks.generateFaasTypes).toHaveBeenCalledWith({
      root,
    })
    expect(logSpy).toHaveBeenCalledWith(
      `[faas types] Up to date ${root}/src/.faasjs/types.d.ts (1 routes from 1 files)`,
    )
  })

  it('should return error code for unknown options', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', '--unknown'])

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith('[faas types] Unknown option: --unknown')
    expect(mocks.loadEnvFileIfExists).not.toHaveBeenCalled()
    expect(mocks.generateFaasTypes).not.toHaveBeenCalled()
  })

  it('should return error code when root option is missing a value', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', '--root'])

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith('[faas types] Missing value for --root')
    expect(mocks.loadEnvFileIfExists).not.toHaveBeenCalled()
    expect(mocks.generateFaasTypes).not.toHaveBeenCalled()
  })

  it('should return error code for unexpected positional argument', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'unexpected'])

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith('[faas types] Unknown option: unexpected')
    expect(mocks.loadEnvFileIfExists).not.toHaveBeenCalled()
    expect(mocks.generateFaasTypes).not.toHaveBeenCalled()
  })

  it('should return error code when type generation fails', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    mocks.generateFaasTypes.mockRejectedValueOnce(Error('boom'))

    const code = await main(['node', 'faas'])

    expect(code).toBe(1)
    expect(mocks.loadEnvFileIfExists).toHaveBeenCalledWith({
      cwd: process.cwd(),
    })
    expect(mocks.generateFaasTypes).toHaveBeenCalledWith({})
    expect(errorSpy).toHaveBeenCalledWith('boom')
  })
})
