import { FaasReactClient, getClient } from '..'

describe('FaasReactClient', () => {
  it('should work', () => {
    const client = FaasReactClient({ domain: 'mock' })

    expect(client).toHaveProperty('faas')
    expect(client).toHaveProperty('useFaas')
    expect(client).toHaveProperty('FaasData')

    expect(getClient()).toBe(client)
  })
})
