import { loadConfig } from '../load_config'

describe('loadConfig', () => {
  test('defaults', () => {
    const config = loadConfig(__dirname, `${__dirname}/fake.func.ts`).defaults

    expect(config.plugins.test.type).toEqual('defaults')
    expect(config.plugins.func.provider).toEqual(config.providers.tc)
    expect(config.plugins.func.name).toEqual('func')
  })

  test('local', () => {
    const config = loadConfig(__dirname, `${__dirname}/fake.func.ts`).local

    expect(config.plugins.func.type).toEqual('function')
    expect(config.plugins.func.provider).toEqual(config.providers.tc)
    expect(config.plugins.func.name).toEqual('func')

    expect(config.plugins.test.type).toEqual('local')
    expect(config.plugins.func.config.env).toEqual('defaults')
  })

  test('sub local', () => {
    const config = loadConfig(__dirname, `${__dirname}/sub/fake.func.ts`).local

    expect(config.plugins.func.type).toEqual('function')
    expect(config.plugins.func.provider).toEqual(config.providers.tc)
    expect(config.plugins.func.name).toEqual('func')

    expect(config.plugins.test.type).toEqual('sublocal')
  })
})
