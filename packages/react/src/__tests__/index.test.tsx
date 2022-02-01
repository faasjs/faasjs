import { FaasReactClient, getClient } from '..'

describe('FaasReactClient', () => {
  it('should work', () => {
    const client = FaasReactClient({ domain: 'mock' })

    expect(client).toHaveProperty('faas')
    expect(client).toHaveProperty('useFaas')
    expect(client).toHaveProperty('FaasDataWrapper')

    expect(getClient()).toBe(client)
  })
})
