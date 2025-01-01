import { describe, expect, it } from 'vitest'
import { main } from '..'

describe('create-faas-app', () => {
  it('should work', async () => {
    const commander = await main(['node', 'script', '--help'])

    expect(commander.args).toEqual(['--help'])
  })
})
