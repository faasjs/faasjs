/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import {
  FaasReactClient, FaasDataWrapper, FaasDataInjection,
} from '..'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

describe('FaasDataWrapper', () => {
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
    function Test (props: Partial<FaasDataInjection>) {
      return <div>{props.data}<button onClick={ () => props.reload() }>Reload</button></div>
    }

    render(<FaasDataWrapper action='test'>
      <Test />
    </FaasDataWrapper>)

    expect(await screen.findByText('1')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('2')).toBeInTheDocument()
  })

  it('should work with controlled params', async () => {
    function App () {
      const [params, setParams] = useState({ v: 1 })

      return <>
        <button onClick={ () => setParams({ v: 10 }) }>Reload</button>
        <FaasDataWrapper
          action='test'
          params={ params }>
          <Test />
        </FaasDataWrapper>
      </>
    }

    function Test (props: Partial<FaasDataInjection>) {
      return <div>{JSON.stringify(props.data)}</div>
    }

    render(<App />)

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('{"v":10}')).toBeInTheDocument()
  })
})
