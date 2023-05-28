/**
 * @jest-environment jsdom
 */
import { FaasReactClient, faas } from '..'

describe('faas', () => {
  let originalFetch: any
  let current = 0

  beforeEach(() => {
    current = 0
    originalFetch = window.fetch
    window.fetch = jest.fn(async (action, args) => {
      console.log(args)
      current ++
      return Promise.resolve({
        status: 200,
        headers: new Map([['Content-Type', 'application/json']]),
        text: async () => (args.body === '{}' ? JSON.stringify({ data: current }) : JSON.stringify({ data: JSON.parse(args.body as string) }))
      }) as unknown as Promise<Response>
    })
    FaasReactClient({ domain: 'test' })
  })

  afterEach(() => {
    window.fetch = originalFetch
  })

  it('should work', async () => {
    expect(await faas('test', { key: 'value' })).toMatchObject({ data: { key: 'value' } })
  })
})
