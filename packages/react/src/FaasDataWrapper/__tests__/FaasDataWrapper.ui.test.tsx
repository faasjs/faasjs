import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef, useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setMock } from '../../index'
import {
  type FaasDataInjection,
  FaasDataWrapper,
  type FaasDataWrapperRef,
  withFaasData,
} from '../../index'

describe('FaasDataWrapper', () => {
  let current = 0

  beforeEach(() => {
    current = 0

    setMock(async (_action, params) => {
      current++

      return new Promise<any>((res) =>
        setTimeout(() =>
          res({
            data: params?.v ? params : current,
          }),
        ),
      )
    })
  })

  it('should work', async () => {
    let renderTimes = 0

    function Test(props: Partial<FaasDataInjection>) {
      renderTimes++
      return (
        <div>
          {props.data}
          <button type="button" onClick={() => props.reload?.()}>
            Reload
          </button>
        </div>
      )
    }

    render(
      <FaasDataWrapper action="t">
        <Test />
      </FaasDataWrapper>,
    )

    expect(await screen.findByText('1')).toBeDefined()
    expect(renderTimes).toEqual(1)

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('2')).toBeDefined()
    expect(renderTimes).toEqual(3)
  })

  it('with controlled params', async () => {
    let renderTimes = 0

    function App() {
      const [params, setParams] = useState({ v: 1 })

      return (
        <>
          <button type="button" onClick={() => setParams({ v: 10 })}>
            Reload
          </button>
          <FaasDataWrapper action="t" params={params}>
            <Test />
          </FaasDataWrapper>
        </>
      )
    }

    function Test(props: Partial<FaasDataInjection>) {
      renderTimes++

      return <div>{JSON.stringify(props.data)}</div>
    }

    render(<App />)

    expect(await screen.findByText('{"v":1}')).toBeDefined()

    expect(renderTimes).toEqual(1)

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('{"v":10}')).toBeDefined()
    expect(renderTimes).toEqual(4)
  })

  it('should poll without toggling loading after the first request', async () => {
    const requests: Array<(value: any) => void> = []

    setMock(
      async () =>
        new Promise<any>((resolve) => {
          requests.push(resolve)
        }),
    )

    render(
      <FaasDataWrapper
        action="t"
        polling={20}
        render={({ data, loading, refreshing }) => (
          <>
            <div>data:{data?.value}</div>
            <div>loading:{String(loading)}</div>
            <div>refreshing:{String(refreshing)}</div>
          </>
        )}
      />,
    )

    await waitFor(() => expect(requests.length).toBe(1))
    requests[0]({ data: { value: 1 } })

    expect(await screen.findByText('data:1')).toBeDefined()
    expect(screen.getByText('loading:false')).toBeDefined()

    await waitFor(() => expect(requests.length).toBe(2))

    expect(screen.getByText('data:1')).toBeDefined()
    expect(screen.getByText('loading:false')).toBeDefined()
    expect(screen.getByText('refreshing:true')).toBeDefined()

    requests[1]({ data: { value: 2 } })

    expect(await screen.findByText('data:2')).toBeDefined()
    expect(screen.getByText('refreshing:false')).toBeDefined()
  })

  it('withFaasData', async () => {
    let renderTimes = 0

    const Test = withFaasData(
      (props) => {
        renderTimes++
        return (
          <div>
            {JSON.stringify(props.data)}
            <button type="button" onClick={() => props.reload()}>
              Reload
            </button>
          </div>
        )
      },
      { action: 'test' },
    )

    render(<Test a={1} />)

    expect(await screen.findByText('1')).toBeDefined()
    expect(renderTimes).toEqual(1)

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('2')).toBeDefined()
    expect(renderTimes).toEqual(3)
  })

  it('ref', async () => {
    let current = 0

    setMock(async () => {
      current++

      return {
        data: current,
      }
    })

    function Test(props: Partial<FaasDataInjection>) {
      return <div>{props.data}</div>
    }

    function App() {
      const ref = useRef<FaasDataWrapperRef>(null)

      return (
        <>
          <button type="button" onClick={() => ref.current?.reload()}>
            Reload
          </button>
          <FaasDataWrapper action="test" ref={ref}>
            <Test />
          </FaasDataWrapper>
        </>
      )
    }

    render(<App />)

    expect(await screen.findByText('1')).toBeDefined()
    expect(current).toEqual(1)

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('2')).toBeDefined()
    expect(current).toEqual(2)
  })

  it('should support render fallback, onDataChange, and controlled data options', async () => {
    const setData = vi.fn()
    const onDataChange = vi.fn()

    render(
      <FaasDataWrapper
        action="test"
        data={{ seeded: true } as any}
        setData={setData}
        onDataChange={onDataChange}
        fallback={<div>Loading...</div>}
        render={({ data }) => <div>{JSON.stringify(data)}</div>}
      />,
    )

    expect(screen.getByText('Loading...')).toBeDefined()

    expect(await screen.findByText('{"seeded":true}')).toBeDefined()
    expect(onDataChange).toHaveBeenCalled()
    expect(setData).toHaveBeenCalled()
  })
})
