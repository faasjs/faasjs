import { describe, expect, it } from 'vitest'
import { version } from '../../package.json'
import { main } from '..'

describe('create-faas-app', () => {
  it('should work', async () => {
    const commander = await main(['node', 'script', '--help'])

    expect(commander.version()).toBe(version)
  })
})
