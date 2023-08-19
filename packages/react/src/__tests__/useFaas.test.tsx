/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { FaasReactClient, useFaas } from '..'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

describe('useFaas', () => {
  let originalFetch: any
  let current = 0

  beforeEach(() => {
    current = 0
    originalFetch = window.fetch
    FaasReactClient({ domain: 'test' })
  })

  afterEach(() => {
    window.fetch = originalFetch
  })

  it('should work', async () => {
    window.fetch = jest.fn(async (action, args) => {
      current ++
      return Promise.resolve({
        status: 200,
        headers: new Map([['Content-Type', 'application/json']]),
        text: async () => JSON.stringify({ data: current }),
      }) as unknown as Promise<Response>
    })

    function Test () {
      const { data, reload } = useFaas<any>('test', {})

      return <div>{data}<button onClick={ () => reload() }>Reload</button></div>
    }

    render(<Test />)

    expect(await screen.findByText('1')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('2')).toBeInTheDocument()
  })

  it('should work with controlled params', async () => {
    window.fetch = jest.fn(async (action, args) => {
      current ++
      return Promise.resolve({
        status: 200,
        headers: new Map([['Content-Type', 'application/json']]),
        text: async () => JSON.stringify({ data: JSON.parse(args.body as string) })
      }) as unknown as Promise<Response>
    })

    function App () {
      const [params, setParams] = useState({ v: 1 })
      const { data } = useFaas<any>('test', params)

      return <>
        <button onClick={ () => setParams({ v: 10 }) }>Reload</button>
        <div>{JSON.stringify(data)}</div>
      </>
    }

    render(<App />)

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('{"v":10}')).toBeInTheDocument()
  })

  it('should work with debounce', async () => {
    let times = 0
    window.fetch = jest.fn(async (action, args) => {
      times ++
      return Promise.resolve({
        status: 200,
        headers: new Map([['Content-Type', 'application/json']]),
        text: async () => JSON.stringify({ data: JSON.parse(args.body as string) }),
      }) as unknown as Promise<Response>
    })

    function Test () {
      const [count, setCount] = useState(0)
      const { data } = useFaas<any>('test', { count }, { debounce: 200 })

      return <div>{data?.count}<button onClick={ () => setCount(p => p + 1) }>Add</button></div>
    }

    render(<Test />)

    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('3')).toBeInTheDocument()
    expect(times).toBe(1)
  })
})
