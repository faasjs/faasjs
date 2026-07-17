import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { main } from '../../index'

type RunCli = (argv: string[], mainFunction: typeof main) => Promise<void>

const originalExitCode = process.exitCode

async function loadRunCli(): Promise<RunCli> {
  const binUrl = new URL('../../../index.mjs', import.meta.url).href
  const bin = (await import(/* @vite-ignore */ binUrl)) as { runCli: RunCli }

  return bin.runCli
}

describe('create-faas-app bin', () => {
  beforeEach(() => {
    process.exitCode = undefined
  })

  afterEach(() => {
    process.exitCode = originalExitCode
    vi.restoreAllMocks()
  })

  it('leaves the exit code successful for help', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const runCli = await loadRunCli()

    await runCli(['node', 'script', '--help'], main)

    expect(process.exitCode).toBeUndefined()
    expect(log).toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
  })

  it('sets a failing exit code and prints unknown options once', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const runCli = await loadRunCli()

    await runCli(['node', 'script', '--definitely-unknown'], main)

    expect(process.exitCode).toBe(1)
    expect(error).toHaveBeenCalledTimes(1)
    expect(error.mock.calls[0][0]).toMatchObject({
      code: 'commander.unknownOption',
      exitCode: 1,
    })
  })

  it('sets a failing exit code and prints action failures once', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const runCli = await loadRunCli()

    await runCli(['node', 'script', '--name', 'broken-app', '--template', 'unknown'], main)

    expect(process.exitCode).toBe(1)
    expect(error).toHaveBeenCalledTimes(1)
    expect(error.mock.calls[0][0]).toMatchObject({
      message: 'Unknown template "unknown". Available templates: admin, minimal',
    })
  })
})
