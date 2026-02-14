import { describe, expect, it } from 'vitest'
import { version } from '../../package.json'
import { main } from '..'

describe('create-faas-app', () => {
  it('should work', async () => {
    const commander = await main(['node', 'script', '--help'])
    const versionOption = commander.options.find(
      (option: { long?: string }) => option.long === '--version'
    )
    const internalCommander = commander as unknown as { _version?: string }

    expect(versionOption).toBeDefined()
    expect(internalCommander._version).toBe(version)
  })
})
