import { setMock } from '..'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef, useState } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { type FaasDataInjection, FaasDataWrapper, type FaasDataWrapperRef, withFaasData } from '..'

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

  afterEach(() => {
    setMock(null)
  })

  it('should work', async () => {
    let renderTimes = 0

    function Test(props: Partial<FaasDataInjection>) {
      renderTimes++
      return (
        <div>
          {props.data}
          <button type='button' onClick={() => props.reload?.()}>
            Reload
          </button>
        </div>
      )
    }

    render(
      <FaasDataWrapper action='t'>
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
          <button type='button' onClick={() => setParams({ v: 10 })}>
            Reload
          </button>
          <FaasDataWrapper action='t' params={params}>
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

  it('withFaasData', async () => {
    let renderTimes = 0

    const Test = withFaasData(
      (props) => {
        renderTimes++
        return (
          <div>
            {props.data.toString()}
            <button type='button' onClick={() => props.reload()}>
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
          <button type='button' onClick={() => ref.current?.reload()}>
            Reload
          </button>
          <FaasDataWrapper action='test' ref={ref}>
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
})
