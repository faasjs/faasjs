import { Logger } from '@faasjs/node-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function noopLoggerMethod(this: Logger) {
  return this
}

describe('cli/index', () => {
  const originalArgv = [...process.argv]
  const originalExitCode = process.exitCode

  beforeEach(() => {
    vi.resetModules()
    process.argv = ['node', 'faasjs-pg', 'unknown']
    process.exitCode = undefined
    vi.spyOn(Logger.prototype, 'error').mockImplementation(noopLoggerMethod)
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    process.argv = [...originalArgv]
    process.exitCode = originalExitCode
    vi.restoreAllMocks()
  })

  it('invokes the real main module and exposes the returned exit code via process.exitCode', async () => {
    await import('../index')
    await Promise.resolve()

    expect(process.exitCode).toBe(1)
    expect(console.error).toHaveBeenCalledWith('ERROR [faasjs-pg] Unknown operation: unknown')
  })
})
