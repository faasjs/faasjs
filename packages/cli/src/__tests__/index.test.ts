import { describe, expect, it } from 'vitest'
import { version } from '../../package.json'
import { main } from '../index'

describe('main function', () => {
  it('should work', async () => {
    const commander = await main([
      'node',
      'script',
      '-v',
      '-r',
      './',
      '-e',
      'env',
      '--help',
    ])

    // @ts-ignore
    expect(commander.version()).toBe(version)
    expect(process.env.verbose).toBe('1')
    expect(process.env.FaasRoot).toBe('./')
    expect(process.env.FaasEnv).toBe('env')
  })
})
