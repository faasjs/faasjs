import { Command } from 'commander'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { main } from '../index'

vi.mock('commander', () => {
  const mCommand = {
    parseAsync: vi.fn(),
    version: vi.fn(() => mCommand),
    usage: vi.fn(() => mCommand),
    option: vi.fn(() => mCommand),
    on: vi.fn(() => mCommand),
    command: vi.fn(() => mCommand),
    name: vi.fn(() => mCommand),
    description: vi.fn(() => mCommand),
    action: vi.fn(() => mCommand),
  }
  return { Command: vi.fn(() => mCommand) }
})

describe('main function', () => {
  let originalArgv: string[]
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalArgv = process.argv
    originalEnv = process.env
    process.argv = ['node', 'script']
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.argv = originalArgv
    process.env = originalEnv
    vi.clearAllMocks()
  })

  it('should call commander.parseAsync when conditions are met', async () => {
    const commander = new Command()
    await main()
    expect(commander.parseAsync).toHaveBeenCalledWith(process.argv)
  })

  it('should not call commander.parseAsync when process.env.CI is set', async () => {
    process.env.CI = 'true'
    const commander = new Command()
    await main()
    expect(commander.parseAsync).not.toHaveBeenCalled()
  })

  it('should not call commander.parseAsync when process.argv[0] is "fake"', async () => {
    process.argv[0] = 'fake'
    const commander = new Command()
    await main()
    expect(commander.parseAsync).not.toHaveBeenCalled()
  })

  it('should log error and exit with code 1 on exception', async () => {
    const commander = new Command();
    (commander.parseAsync as Mock).mockImplementation(() => {
      throw new Error('Test error')
    })
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => { })
    const processExitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation(code => {
        throw new Error(`process.exit: ${code}`)
      })

    await expect(main()).rejects.toThrow('process.exit: 1')
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error))
    expect(processExitSpy).toHaveBeenCalledWith(1)

    consoleErrorSpy.mockRestore()
    processExitSpy.mockRestore()
  })
})
