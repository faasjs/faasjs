/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { FaasReactClient, FaasDataWrapper, FaasDataInjection } from '..'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Response, setMock } from '@faasjs/browser'

describe('FaasDataWrapper', () => {
  let current = 0

  beforeEach(() => {
    current = 0

    setMock(async (action, params) => {
      current++

      return Promise.resolve(
        new Response({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          data: params?.v ? params : current,
        })
      )
    })

    FaasReactClient({ domain: 'test' })
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

    expect(await screen.findByText('1')).toBeInTheDocument()
    expect(renderTimes).toEqual(1)

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('2')).toBeInTheDocument()
  })

  it('should work with controlled params', async () => {
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
      return <div>{JSON.stringify(props.data)}</div>
    }

    render(<App />)

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('{"v":10}')).toBeInTheDocument()
  })
})
