import { describe, expect, it, vi } from 'vitest'

import { version } from '../../../../../package.json'
import { main } from '../../index'

describe('create-faas-app', () => {
  it('should work', async () => {
    const commander = await main(['node', 'script', '--help'])
    const versionOption = commander.options.find(
      (option: { long?: string }) => option.long === '--version',
    )
    const templateOption = commander.options.find(
      (option: { long?: string }) => option.long === '--template',
    )
    const internalCommander = commander as unknown as { _version?: string }

    expect(versionOption).toBeDefined()
    expect(templateOption).toBeDefined()
    expect((templateOption as { defaultValue?: string }).defaultValue).toBe('admin')
    expect(internalCommander._version).toBe(version)
  })

  it('should ignore commander help errors', async () => {
    const commander = await main(['node', 'script', '--help'])
    const parseAsync = vi
      .spyOn(commander, 'parseAsync')
      .mockRejectedValueOnce({ code: 'commander.helpDisplayed' })
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    await expect(main(['node', 'script'])).resolves.toBe(commander)
    expect(error).not.toHaveBeenCalled()

    parseAsync.mockRestore()
    error.mockRestore()
  })

  it('should rethrow the original unexpected commander error', async () => {
    const commander = await main(['node', 'script', '--help'])
    const failure = new Error('boom')
    const parseAsync = vi.spyOn(commander, 'parseAsync').mockRejectedValueOnce(failure)
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    await expect(main(['node', 'script'])).rejects.toBe(failure)
    expect(error).not.toHaveBeenCalled()

    parseAsync.mockRestore()
    error.mockRestore()
  })

  it('should reject unknown options', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    await expect(
      main([
        'node',
        'script',
        '--definitely-unknown',
        '--name',
        'broken-app',
        '--template',
        'unknown',
      ]),
    ).rejects.toMatchObject({
      code: 'commander.unknownOption',
      exitCode: 1,
    })
    expect(error).not.toHaveBeenCalled()
  })

  it('should rethrow action failures', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    await expect(
      main(['node', 'script', '--name', 'broken-app', '--template', 'unknown']),
    ).rejects.toThrow('Unknown template "unknown". Available templates: admin, minimal')
    expect(error).not.toHaveBeenCalled()
  })
})
