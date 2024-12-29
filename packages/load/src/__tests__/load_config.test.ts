import { describe, expect, it } from 'vitest'
import { loadConfig } from '../load_config'

describe('loadConfig', () => {
  it('defaults', () => {
    const config = loadConfig(
      __dirname,
      `${__dirname}/fake.func.ts`,
      'defaults'
    )

    expect(config.plugins.test.type).toEqual('defaults')
    expect(config.plugins.func.name).toEqual('func')
  })

  it('local', () => {
    const config = loadConfig(__dirname, `${__dirname}/fake.func.ts`, 'local')

    expect(config.plugins.func.type).toEqual('function')
    expect(config.plugins.func.name).toEqual('func')

    expect(config.plugins.test.type).toEqual('local')
    expect(config.plugins.func.config.env).toEqual('defaults')
  })

  it('sub local', () => {
    const config = loadConfig(
      __dirname,
      `${__dirname}/sub/fake.func.ts`,
      'local'
    )

    expect(config.plugins.func.type).toEqual('function')
    expect(config.plugins.func.name).toEqual('func')

    expect(config.plugins.test.type).toEqual('sublocal')
  })
})
