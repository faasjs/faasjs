import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'

import { FaasReactClient, Response, setMock } from '../../index'
import { useFaas } from '../../useFaas'

describe('useFaas', () => {
  let current = 0

  beforeEach(() => {
    current = 0
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

    let renderTimes = 0

    function Test() {
      const faas = useFaas<any>('test', {})

      renderTimes++

      return (
        <div>
          {faas.data}
          <div>reloadTimes:{faas.reloadTimes}</div>
          <button type="button" onClick={() => faas.reload()}>
            Reload
          </button>
        </div>
      )
    }

    render(<Test />)

    expect(await screen.findByText('1')).toBeDefined()
    expect(screen.getByText('reloadTimes:0')).toBeDefined()
    expect(renderTimes).toBe(2)

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('2')).toBeDefined()
    expect(screen.getByText('reloadTimes:1')).toBeDefined()
    expect(renderTimes).toBe(5)
  })

  it('should work with controlled params', async () => {
    setMock(async (_, params) => {
      current++
      return Promise.resolve(
        new Response({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          data: params,
        }),
      )
    })

    function App() {
      const [params, setParams] = useState({ v: 1 })
      const { data } = useFaas<any>('test', params)

      return (
        <>
          <button type="button" onClick={() => setParams({ v: 10 })}>
            Reload
          </button>
          <div>{JSON.stringify(data)}</div>
        </>
      )
    }

    render(<App />)

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('{"v":10}')).toBeDefined()
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
        }),
      )
    })

    function Test() {
      const [count, setCount] = useState(0)
      const { data } = useFaas<any>('test', { count }, { debounce: 200 })

      return (
        <div>
          {data?.count}
          <button type="button" onClick={() => setCount((p) => p + 1)}>
            Add
          </button>
        </div>
      )
    }

    render(<Test />)

    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('3')).toBeDefined()
    expect(times).toBe(1)
  })

  it('should poll silently after the first request', async () => {
    const requests: Array<(value: Response<any>) => void> = []

    setMock(
      async () =>
        new Promise<Response<any>>((resolve) => {
          requests.push(resolve)
        }),
    )

    function Test() {
      const { data, loading, refreshing, reloadTimes } = useFaas<any>('test', {}, { polling: 20 })

      return (
        <>
          <div>data:{data?.value}</div>
          <div>loading:{String(loading)}</div>
          <div>refreshing:{String(refreshing)}</div>
          <div>reloadTimes:{reloadTimes}</div>
        </>
      )
    }

    render(<Test />)

    expect(await screen.findByText('loading:true')).toBeDefined()

    requests[0](new Response({ data: { value: 1 } }))

    expect(await screen.findByText('data:1')).toBeDefined()
    expect(screen.getByText('loading:false')).toBeDefined()

    await waitFor(() => expect(requests.length).toBe(2))

    expect(screen.getByText('data:1')).toBeDefined()
    expect(screen.getByText('loading:false')).toBeDefined()
    expect(screen.getByText('refreshing:true')).toBeDefined()
    expect(screen.getByText('reloadTimes:1')).toBeDefined()

    requests[1](new Response({ data: { value: 2 } }))

    expect(await screen.findByText('data:2')).toBeDefined()
    expect(screen.getByText('loading:false')).toBeDefined()
    expect(screen.getByText('refreshing:false')).toBeDefined()
  })

  it('should support silent reload', async () => {
    const requests: Array<(value: Response<any>) => void> = []

    setMock(
      async () =>
        new Promise<Response<any>>((resolve) => {
          requests.push(resolve)
        }),
    )

    function Test() {
      const faas = useFaas<any>('test', {})

      return (
        <>
          <div>data:{faas.data?.value}</div>
          <div>loading:{String(faas.loading)}</div>
          <div>refreshing:{String(faas.refreshing)}</div>
          <button type="button" onClick={() => faas.reload(undefined, { silent: true })}>
            Silent Reload
          </button>
        </>
      )
    }

    render(<Test />)

    await waitFor(() => expect(requests.length).toBe(1))
    requests[0](new Response({ data: { value: 1 } }))

    expect(await screen.findByText('data:1')).toBeDefined()

    await userEvent.click(screen.getByText('Silent Reload'))

    await waitFor(() => expect(requests.length).toBe(2))

    expect(screen.getByText('data:1')).toBeDefined()
    expect(screen.getByText('loading:false')).toBeDefined()
    expect(screen.getByText('refreshing:true')).toBeDefined()

    requests[1](new Response({ data: { value: 2 } }))

    expect(await screen.findByText('data:2')).toBeDefined()
    expect(screen.getByText('refreshing:false')).toBeDefined()
  })

  it('should work with skip and reload', async () => {
    setMock(async (_, params) => {
      current++
      return Promise.resolve(
        new Response({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          data: params,
        }),
      )
    })

    let resolvedData: any

    function Test() {
      const faas = useFaas<any>('test', { v: 1 }, { skip: true })

      return (
        <>
          <button
            type="button"
            onClick={async () => {
              resolvedData = await faas.reload()
            }}
          >
            Reload
          </button>
          <div>data:{faas.data?.v}</div>
        </>
      )
    }

    render(<Test />)

    expect(await screen.findByText('data:')).toBeDefined()

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('data:1')).toBeDefined()
    expect(resolvedData).toEqual({ v: 1 })
  })

  it('should work with controlled data and setData', async () => {
    setMock(async () =>
      Promise.resolve(
        new Response({
          data: {
            value: 2,
          },
        }),
      ),
    )

    function Test() {
      const [data, setData] = useState({
        value: 0,
      })
      const faas = useFaas<any>('test', {}, { data, setData })

      return <div>{JSON.stringify(faas.data)}</div>
    }

    render(<Test />)

    expect(await screen.findByText('{"value":2}')).toBeDefined()
  })

  it('should expose promise and state setters', async () => {
    setMock(async () =>
      Promise.resolve(
        new Response({
          data: {
            value: 1,
          },
        }),
      ),
    )

    let promiseData: any
    let previousPromiseData: any

    function Test() {
      const faas = useFaas<any>('test', {})

      return (
        <>
          <div>data:{JSON.stringify(faas.data)}</div>
          <div>loading:{String(faas.loading)}</div>
          <div>error:{faas.error?.message || ''}</div>
          <button
            type="button"
            onClick={async () => {
              promiseData = await faas.promise.then((response) => response.data)
            }}
          >
            Read Promise
          </button>
          <button
            type="button"
            onClick={async () => {
              faas.setPromise(async (prev) => {
                previousPromiseData = await prev.then((response) => response.data)
                return new Response({
                  data: {
                    value: 9,
                  },
                })
              })
            }}
          >
            Set Promise
          </button>
          <button
            type="button"
            onClick={() => {
              faas.setPromise(
                Promise.resolve(
                  new Response({
                    data: {
                      value: 10,
                    },
                  }),
                ),
              )
              faas.setLoading(true)
            }}
          >
            Set Promise Direct
          </button>
          <button
            type="button"
            onClick={() =>
              faas.setData({
                value: 3,
              })
            }
          >
            Set Data
          </button>
          <button type="button" onClick={() => faas.setLoading(true)}>
            Set Loading
          </button>
          <button type="button" onClick={() => faas.setError(new Error('manual error'))}>
            Set Error
          </button>
        </>
      )
    }

    render(<Test />)

    expect(await screen.findByText('data:{"value":1}')).toBeDefined()

    await userEvent.click(screen.getByText('Read Promise'))
    await waitFor(() => expect(promiseData).toEqual({ value: 1 }))

    await userEvent.click(screen.getByText('Set Promise'))
    await waitFor(() => expect(previousPromiseData).toEqual({ value: 1 }))

    await userEvent.click(screen.getByText('Set Promise Direct'))
    await userEvent.click(screen.getByText('Read Promise'))
    await waitFor(() => expect(promiseData).toEqual({ value: 10 }))

    await userEvent.click(screen.getByText('Set Data'))
    expect(screen.getByText('data:{"value":3}')).toBeDefined()

    await userEvent.click(screen.getByText('Set Loading'))
    expect(screen.getByText('loading:true')).toBeDefined()

    await userEvent.click(screen.getByText('Set Error'))
    expect(screen.getByText('error:manual error')).toBeDefined()
  })

  it('should work with skip predicate', async () => {
    let requestCount = 0

    setMock(async (_, params) => {
      requestCount++
      return Promise.resolve(
        new Response({
          data: params,
        }),
      )
    })

    function Test() {
      const [enabled, setEnabled] = useState(false)
      const { data, loading } = useFaas<any>(
        'test',
        { enabled },
        { skip: (params) => !params.enabled },
      )

      return (
        <>
          <div>data:{String(data?.enabled)}</div>
          <div>loading:{String(loading)}</div>
          <button type="button" onClick={() => setEnabled(true)}>
            Enable
          </button>
        </>
      )
    }

    render(<Test />)

    expect(await screen.findByText('loading:false')).toBeDefined()
    expect(requestCount).toBe(0)

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('data:true')).toBeDefined()
    expect(requestCount).toBe(1)
  })

  it('should use options.params without mutating stored params', async () => {
    setMock(async (_, params) =>
      Promise.resolve(
        new Response({
          data: params,
        }),
      ),
    )

    function Test() {
      const faas = useFaas<any>(
        'test',
        {
          from: 'state',
        },
        {
          params: {
            from: 'options',
          },
        },
      )

      return (
        <>
          <div>data:{JSON.stringify(faas.data)}</div>
          <div>params:{JSON.stringify(faas.params)}</div>
        </>
      )
    }

    render(<Test />)

    expect(await screen.findByText('data:{"from":"options"}')).toBeDefined()
    expect(screen.getByText('params:{"from":"state"}')).toBeDefined()
  })

  it('should reload with next params', async () => {
    setMock(async (_, params) =>
      Promise.resolve(
        new Response({
          data: params,
        }),
      ),
    )

    function Test() {
      const faas = useFaas<any>('test', { v: 1 }, { skip: true })

      return (
        <>
          <div>data:{faas.data?.v}</div>
          <div>params:{faas.params.v}</div>
          <button type="button" onClick={() => faas.reload({ v: 2 })}>
            Reload With Params
          </button>
        </>
      )
    }

    render(<Test />)

    expect(await screen.findByText('params:1')).toBeDefined()

    await userEvent.click(screen.getByText('Reload With Params'))

    expect(await screen.findByText('data:2')).toBeDefined()
    expect(screen.getByText('params:2')).toBeDefined()
  })

  it('should reject reload on error', async () => {
    setMock(async () => {
      throw new Error('Network error')
    })

    let rejectedError: any

    function Test() {
      const faas = useFaas<any>('test', {}, { skip: true })

      return (
        <>
          <button
            type="button"
            onClick={async () => {
              try {
                await faas.reload()
              } catch (error) {
                rejectedError = error
              }
            }}
          >
            Reload Error
          </button>
          <div>error:{faas.error?.message || ''}</div>
        </>
      )
    }

    render(<Test />)

    await userEvent.click(screen.getByText('Reload Error'))

    await waitFor(() => expect(rejectedError?.message).toBe('Network error'))
    expect(screen.getByText('error:Network error')).toBeDefined()
  })

  it('should use baseUrl client and surface transformed errors', async () => {
    setMock(null)

    const requests: string[] = []
    let onErrorCalls = 0

    FaasReactClient({
      baseUrl: '/use-faas-errors/',
      options: {
        request: async (url) => {
          requests.push(url)
          throw new Error('request failed')
        },
      },
      onError: () => async () => {
        onErrorCalls++
        throw new Error(`handled-${onErrorCalls}`)
      },
    })

    function Test() {
      const { error } = useFaas<any>('hello', undefined as any, { baseUrl: '/use-faas-errors/' })

      return <div>error:{error?.message || ''}</div>
    }

    render(<Test />)

    expect(await screen.findByText('error:handled-2')).toBeDefined()
    expect(requests[0]).toContain('/use-faas-errors/hello?_=')
    expect(onErrorCalls).toBe(2)
  })

  it('should ignore aborted requests', async () => {
    setMock(null)

    const requests: {
      signal: AbortSignal | undefined
      resolve: (value: Response<any>) => void
    }[] = []

    FaasReactClient({
      baseUrl: '/use-faas-abort/',
      options: {
        request: async (_url, options) =>
          await new Promise<Response<any>>((resolve, reject) => {
            requests.push({
              signal: options.signal as AbortSignal | undefined,
              resolve,
            })
            options.signal?.addEventListener('abort', () => reject(new Error('aborted')))
          }),
      },
    })

    function Test() {
      const [value, setValue] = useState(1)
      const { data, error } = useFaas<any>('test', { value }, { baseUrl: '/use-faas-abort/' })

      return (
        <>
          <button type="button" onClick={() => setValue(2)}>
            Change
          </button>
          <div>data:{data?.value}</div>
          <div>error:{error?.message || ''}</div>
        </>
      )
    }

    render(<Test />)

    await waitFor(() => expect(requests.length).toBe(1))

    await userEvent.click(screen.getByText('Change'))

    await waitFor(() => {
      expect(requests.length).toBe(2)
      expect(requests[0].signal?.aborted).toBe(true)
    })

    requests[1].resolve(
      new Response({
        data: {
          value: 2,
        },
      }),
    )

    expect(await screen.findByText('data:2')).toBeDefined()
    expect(screen.getByText('error:')).toBeDefined()
  })
})
