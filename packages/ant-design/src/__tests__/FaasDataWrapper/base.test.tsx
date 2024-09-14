/**
 * @jest-environment jsdom
 */
import { FaasReactClient } from '@faasjs/react'
import { render, screen } from '@testing-library/react'
import { FaasDataWrapper, withFaasData } from '../../FaasDataWrapper'

describe('FaasDataWrapper', () => {
  let originalFetch: any

  beforeEach(() => {
    originalFetch = window.fetch
    window.fetch = jest.fn(async () => {
      return Promise.resolve({
        status: 200,
        headers: new Map([['Content-Type', 'application/json']]),
        text: async () => Promise.resolve('{"data":{"test":"value"}}'),
      }) as unknown as Promise<Response>
    })
    FaasReactClient({ domain: '/' })
  })

  afterEach(() => {
    window.fetch = originalFetch
  })

  it('using FaasDataWrapper', async () => {
    render(
      <FaasDataWrapper<{ test: string }>
        action='test'
        render={({ data }) => <div>{data.test}</div>}
      />
    )

    expect(await screen.findByText('value')).toBeDefined()
  })

  it('using withFaasData', async () => {
    render(
      withFaasData(props => <div>{props.data.test}</div>, { action: 'test' })(
        {}
      )
    )

    expect(await screen.findByText('value')).toBeDefined()
  })
})
