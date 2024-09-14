/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { FaasDataWrapper, type FaasDataInjection, withFaasData } from '..'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Response, setMock } from '@faasjs/browser'

describe('FaasDataWrapper', () => {
  let current = 0

  beforeEach(() => {
    current = 0

    setMock(async (_action, params) => {
      current++

      return Promise.resolve(
        new Response({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          data: params?.v ? params : current,
        })
      )
    })
  })

  afterEach(() => {
    setMock(undefined)
  })

  it('should work', async () => {
    let renderTimes = 0
    function Test(props: Partial<FaasDataInjection>) {
      renderTimes++
      return (
        <div>
          {props.data}
          <button type='button' onClick={() => props.reload()}>
            Reload
          </button>
        </div>
      )
    }

    render(
      <FaasDataWrapper action='test'>
        <Test />
      </FaasDataWrapper>
    )

    expect(await screen.findByText('1')).toBeDefined()
    expect(renderTimes).toEqual(1)

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('2')).toBeDefined()
    expect(renderTimes).toEqual(3)
  })

  it('should work with controlled params', async () => {
    let renderTimes = 0

    function App() {
      const [params, setParams] = useState({ v: 1 })

      return (
        <>
          <button type='button' onClick={() => setParams({ v: 10 })}>
            Reload
          </button>
          <FaasDataWrapper action='test' params={params}>
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

  it('should work with withFaasData', async () => {
    let renderTimes = 0

    const Test = withFaasData(
      props => {
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
      { action: 'test' }
    )

    render(<Test a={1} />)

    expect(await screen.findByText('1')).toBeDefined()
    expect(renderTimes).toEqual(1)

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('2')).toBeDefined()
    expect(renderTimes).toEqual(3)
  })
})
