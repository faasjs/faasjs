import { describe, expect, it } from 'vitest'

import { main } from '..'
import { version } from '../../package.json'

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
    expect(internalCommander._version).toBe(version)
  })
})
