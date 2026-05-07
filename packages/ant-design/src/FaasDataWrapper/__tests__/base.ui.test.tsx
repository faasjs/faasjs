declare module '@faasjs/types' {
  interface FaasActions {
    baseUiTest: {
      Params: Record<string, unknown>
      Data: { test: string }
    }
  }
}

import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FaasDataWrapper, withFaasData } from '../../FaasDataWrapper'

describe('FaasDataWrapper', () => {
  let originalFetch: any

  beforeEach(() => {
    originalFetch = window.fetch
    window.fetch = vi.fn<() => Promise<Response>>(async () => {
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
      <FaasDataWrapper<'baseUiTest'>
        action="baseUiTest"
        render={({ data }) => <div>{data.test}</div>}
      />,
    )

    expect(await screen.findByText('value')).toBeDefined()
  })

  it('using withFaasData', async () => {
    const App = withFaasData<'baseUiTest'>((props) => <div>{props.data.test}</div>, {
      action: 'baseUiTest',
    })

    render(<App />)

    expect(await screen.findByText('value')).toBeDefined()
  })
})
