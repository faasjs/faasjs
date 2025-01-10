import { describe, expect, it } from 'vitest'
import { main } from '..'
import { version } from '../../package.json'

describe('create-faas-app', () => {
  it('should work', async () => {
    const commander = await main(['node', 'script', '--help'])

    // @ts-ignore
    expect(commander.version()).toBe(version)
  })
})
