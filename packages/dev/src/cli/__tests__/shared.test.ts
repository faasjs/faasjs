import { describe, expect, it, vi } from 'vitest'
import { parseCommonCliArgs, runCli } from '../shared'

describe('cli shared helpers', () => {
  it('should parse run mode with root and rest arguments', () => {
    const parsed = parseCommonCliArgs(['--root', '/tmp/project', 'types'], 'faas test')

    expect(parsed).toEqual({
      mode: 'run',
      options: {
        root: '/tmp/project',
      },
      rest: ['types'],
    })
  })

  it('should throw when --root has no value', () => {
    expect(() => parseCommonCliArgs(['--root'], 'faas test')).toThrow(
      '[faas test] Missing value for --root',
    )
  })

  it('should return help mode when help option is present', () => {
    const parsed = parseCommonCliArgs(['--help', 'types'], 'faas test')

    expect(parsed.mode).toBe('help')
  })

  it('should return error code and print message when runCli throws', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const code = await runCli(async () => {
      throw Error('boom')
    })

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith('boom')
  })

  it('should fallback to raw error object when message is missing', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const thrown = { code: 500 }
    const code = await runCli(async () => {
      throw thrown
    })

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith(thrown)
  })
})
