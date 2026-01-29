import { type Response, setMock } from '@faasjs/browser'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useFaasStream } from '../useFaasStream'

function createAsyncMockStream(chunks: string[]): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(new TextEncoder().encode(chunk))
      }
      controller.close()
    },
  })
}

describe('useFaasStream', () => {
  afterEach(() => {
    vi.useRealTimers()
    setMock(null)
  })

  it('should work with initial state', async () => {
    setMock({
      body: createAsyncMockStream(['Hello']),
    })

    function Test() {
      const { data } = useFaasStream('test', {})

      return <div>{data}</div>
    }

    render(<Test />)

    expect(screen.queryByText('Hello')).toBeDefined()
  })

  it('should accumulate streaming data', async () => {
    setMock({
      body: createAsyncMockStream(['Hello ', 'World', '!']),
    })

    function Test() {
      const { data } = useFaasStream('test', {})

      return <div>{data}</div>
    }

    render(<Test />)

    expect(screen.queryByText('Hello World!')).toBeDefined()
  })

  it('should handle empty stream', async () => {
    setMock({
      body: createAsyncMockStream([]),
    })

    function Test() {
      const { data, loading } = useFaasStream('test', {})

      return (
        <div>
          <div>data:{data}</div>
          <div>loading:{String(loading)}</div>
        </div>
      )
    }

    render(<Test />)

    expect(screen.queryByText('data:')).toBeDefined()
  })

  it('should handle single chunk', async () => {
    setMock({
      body: createAsyncMockStream(['test']),
    })

    function Test() {
      const { data } = useFaasStream('test', {})

      return <div>{data}</div>
    }

    render(<Test />)

    expect(screen.queryByText('test')).toBeDefined()
  })

  it('should handle error during streaming', async () => {
    const errorStream = new ReadableStream({
      start(controller) {
        controller.error(new Error('Stream error'))
      },
    })

    setMock({
      status: 200,
      body: errorStream,
      headers: { 'Content-Type': 'text/plain' },
    } as Response)

    function Test() {
      const { data, loading, error } = useFaasStream('test', {})

      return (
        <div>
          <div>
            <span>data:</span>
            <span>{data}</span>
          </div>
          <div>
            <span>loading:</span>
            <span>{String(loading)}</span>
          </div>
          <div>
            <span>error:</span>
            <span>{String(error?.message)}</span>
          </div>
        </div>
      )
    }

    render(<Test />)

    expect(screen.queryByText('Stream error')).toBeDefined()
  })

  it('should reload with new data', async () => {
    function Test() {
      const { data, reload } = useFaasStream('test', {})

      return (
        <div>
          <div>{data}</div>
          <button type='button' onClick={() => reload()}>
            Reload
          </button>
        </div>
      )
    }

    setMock({
      body: createAsyncMockStream(['first']),
    })

    render(<Test />)

    expect(screen.queryByText('first')).toBeDefined()

    setMock({
      body: createAsyncMockStream(['second']),
    })

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryByText('second')).toBeDefined()
  })

  it('should reload without params', async () => {
    function Test() {
      const { data, reload } = useFaasStream('test', {})

      return (
        <div>
          <div>{data}</div>
          <button type='button' onClick={() => reload()}>
            Reload
          </button>
        </div>
      )
    }

    setMock({
      body: createAsyncMockStream(['test']),
    })

    render(<Test />)

    expect(screen.queryByText('test')).toBeDefined()

    setMock({
      body: createAsyncMockStream(['reloaded']),
    })

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryByText('reloaded')).toBeDefined()
  })

  it('should reload with skip true', async () => {
    function Test() {
      const { data, reload } = useFaasStream('test', {}, { skip: true })

      return (
        <div>
          <div>data-value:{data}</div>
          <button type='button' onClick={() => reload()}>
            Reload
          </button>
        </div>
      )
    }

    render(<Test />)

    expect(screen.queryByText('data-value:')).toBeDefined()

    setMock({
      body: createAsyncMockStream(['test']),
    })

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryByText('data-value:test')).toBeDefined()
  })

  it('should work with debounce', async () => {
    let requestCount = 0
    const requests: any[] = []

    setMock(() => {
      requestCount++
      return new Promise(resolve => {
        requests.push(resolve)
      }) as any
    })

    function Test() {
      const [count, setCount] = useState(0)
      const { data } = useFaasStream('test', { count }, { debounce: 200 })

      return (
        <div>
          <div>{data}</div>
          <button type='button' onClick={() => setCount(p => p + 1)}>
            Add
          </button>
        </div>
      )
    }

    render(<Test />)

    await new Promise(resolve => setTimeout(resolve, 250))

    requests[0]({
      status: 200,
      body: createAsyncMockStream(['initial']),
      headers: { 'Content-Type': 'text/plain' },
    } as Response)

    await new Promise(resolve => setTimeout(resolve, 50))
    expect(screen.queryByText('initial')).toBeDefined()
    expect(requestCount).toBe(1)

    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByRole('button'))

    await new Promise(resolve => setTimeout(resolve, 250))

    requests[1]({
      status: 200,
      body: createAsyncMockStream(['request1']),
      headers: { 'Content-Type': 'text/plain' },
    } as Response)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(screen.queryByText('request1')).toBeDefined()
    expect(requestCount).toBe(2)
    expect(requests.length).toBe(2)
  })

  it('should work with skip option', async () => {
    function Test() {
      const { data, reload } = useFaasStream('test', {}, { skip: true })

      return (
        <div>
          <div>data-value:{data}</div>
          <button type='button' onClick={() => reload()}>
            Reload
          </button>
        </div>
      )
    }

    render(<Test />)

    expect(screen.queryByText('data-value:')).toBeDefined()

    setMock({
      body: createAsyncMockStream(['test']),
    })

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryByText('data-value:test')).toBeDefined()
  })

  it('should work with skip function', async () => {
    function Test() {
      const [hasValue, setHasValue] = useState(false)
      const { data } = useFaasStream(
        'test',
        { hasValue },
        {
          skip: params => !params.hasValue,
        }
      )

      return (
        <div>
          <div>data-value:{data}</div>
          <button type='button' onClick={() => setHasValue(true)}>
            Set Value
          </button>
        </div>
      )
    }

    render(<Test />)

    expect(screen.queryByText('data-value:')).toBeDefined()

    setMock({
      body: createAsyncMockStream(['test']),
    })

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryByText('data-value:test')).toBeDefined()
  })

  it('should work with custom data and setData', async () => {
    setMock({
      body: createAsyncMockStream(['Hello ', 'World', '!']),
    })

    function Test() {
      const { data } = useFaasStream(
        'test',
        {},
        {
          data: 'initial',
          setData: () => {},
        }
      )

      return <div>{data}</div>
    }

    render(<Test />)

    expect(screen.queryByText('initial')).toBeDefined()
  })

  it('should work with controlled params', async () => {
    function App() {
      const { data, reload } = useFaasStream('test', { v: 1 })

      return (
        <>
          <button type='button' onClick={() => reload()}>
            Reload
          </button>
          <div>data-value:{data}</div>
        </>
      )
    }

    setMock({
      body: createAsyncMockStream(['{"v":1}']),
    })

    render(<App />)

    expect(screen.queryByText('data-value:{"v":1}')).toBeDefined()

    setMock({
      body: createAsyncMockStream(['{"v":10}']),
    })

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryByText('data-value:{"v":10}')).toBeDefined()
  })

  it('should handle Failed to fetch retry', async () => {
    let attempt = 0

    setMock(async () => {
      attempt++
      if (attempt === 1) {
        throw new Error('Failed to fetch')
      } else {
        return {
          status: 200,
          body: createAsyncMockStream(['success']),
          headers: { 'Content-Type': 'text/plain' },
        }
      }
    })

    function Test() {
      const { data } = useFaasStream('test', {})

      return <div>{data}</div>
    }

    render(<Test />)

    expect(screen.queryByText('success')).toBeDefined()
  })

  it('should handle error', async () => {
    setMock(async () => {
      throw new Error('Network error')
    })

    function Test() {
      const { error } = useFaasStream('test', {})

      return (
        <div>
          <span>error:</span>
          <span>{error?.message}</span>
        </div>
      )
    }

    render(<Test />)

    expect(screen.queryByText('error:')).toBeDefined()
    expect(screen.queryByText('Network error')).toBeDefined()
  })

  it('should reload return promise', async () => {
    let resolvedData: string | undefined

    function Test() {
      const { reload } = useFaasStream('test', {})

      async function handleClick() {
        resolvedData = await reload()
      }

      return (
        <button type='button' onClick={handleClick}>
          Reload
        </button>
      )
    }

    setMock({
      body: createAsyncMockStream(['test']),
    })

    render(<Test />)

    setMock({
      body: createAsyncMockStream(['test']),
    })

    await userEvent.click(screen.getByRole('button'))

    await waitFor(() => expect(resolvedData).toBe('test'))
  })

  it('should reload reject on error', async () => {
    setMock(async () => {
      throw new Error('Network error')
    })

    let rejectedError: any

    function Test() {
      const { reload } = useFaasStream('test', {})

      async function handleClick() {
        try {
          await reload()
        } catch (e) {
          rejectedError = e
        }
      }

      return (
        <button type='button' onClick={handleClick}>
          Reload
        </button>
      )
    }

    render(<Test />)

    await userEvent.click(screen.getByRole('button'))

    await waitFor(() => expect(rejectedError?.message).toBe('Network error'))
  })

  it('should reset state on reload', async () => {
    function Test() {
      const { data, loading, reload } = useFaasStream('test', {})

      return (
        <div>
          <div>
            <span>data-value:</span>
            <span>{data}</span>
          </div>
          <div>
            <span>loading:</span>
            <span>{String(loading)}</span>
          </div>
          <button type='button' onClick={() => reload()}>
            Reload
          </button>
        </div>
      )
    }

    setMock({
      body: createAsyncMockStream(['first']),
    })

    render(<Test />)

    await screen.findByText('false')

    setMock({
      body: createAsyncMockStream(['second']),
    })

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryByText('second')).toBeDefined()
  })
})
