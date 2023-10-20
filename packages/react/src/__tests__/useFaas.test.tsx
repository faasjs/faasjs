/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { FaasReactClient, useFaas } from '..'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Response, setMock } from '@faasjs/browser'

describe('useFaas', () => {
  let current = 0

  beforeEach(() => {
    current = 0
    FaasReactClient({ domain: 'test' })
  })

  afterEach(() => {
    setMock(undefined)
  })

  it('should work', async () => {
    setMock(async () => {
      current++
      return Promise.resolve({
        status: 200,
        headers: new Map([['Content-Type', 'application/json']]),
        data: current,
      }) as unknown as Promise<Response>
    })

    function Test() {
      const { data, reload } = useFaas<any>('test', {})

      return (
        <div>
          {data}
          <button type='button' onClick={() => reload()}>
            Reload
          </button>
        </div>
      )
    }

    render(<Test />)

    expect(await screen.findByText('1')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('2')).toBeInTheDocument()
  })

  it('should work with controlled params', async () => {
    setMock(async (_, params) => {
      current++
      return Promise.resolve(
        new Response({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          data: params,
        })
      )
    })

    function App() {
      const [params, setParams] = useState({ v: 1 })
      const { data } = useFaas<any>('test', params)

      return (
        <>
          <button type='button' onClick={() => setParams({ v: 10 })}>
            Reload
          </button>
          <div>{JSON.stringify(data)}</div>
        </>
      )
    }

    render(<App />)

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('{"v":10}')).toBeInTheDocument()
  })

  it('should work with debounce', async () => {
    let times = 0
    setMock(async (_, params) => {
      times++
      return Promise.resolve(
        new Response({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          data: params,
        })
      )
    })

    function Test() {
      const [count, setCount] = useState(0)
      const { data } = useFaas<any>('test', { count }, { debounce: 200 })

      return (
        <div>
          {data?.count}
          <button type='button' onClick={() => setCount(p => p + 1)}>
            Add
          </button>
        </div>
      )
    }

    render(<Test />)

    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('3')).toBeInTheDocument()
    expect(times).toBe(1)
  })
})
