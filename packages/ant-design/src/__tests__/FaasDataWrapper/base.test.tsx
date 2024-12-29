import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FaasDataWrapper, withFaasData } from '../../FaasDataWrapper'

describe('FaasDataWrapper', () => {
  let originalFetch: any

  beforeEach(() => {
    originalFetch = window.fetch
    window.fetch = vi.fn(async () => {
      return Promise.resolve({
        status: 200,
        headers: new Map([['Content-Type', 'application/json']]),
        text: async () => Promise.resolve('{"data":{"test":"value"}}'),
      }) as unknown as Promise<Response>
    })
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
    const App = withFaasData<{ test: string }>(
      props => <div>{props.data.test}</div>,
      {
        action: 'test',
      }
    )

    render(<App />)

    expect(await screen.findByText('value')).toBeDefined()
  })
})
