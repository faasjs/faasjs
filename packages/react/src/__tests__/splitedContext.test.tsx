/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createSplitedContext } from '../splitedContext'
import { memo, useEffect, useState } from 'react'

describe('createSplitedContext', () => {
  it('should render children with provided values', () => {
    const { Provider, use } = createSplitedContext({
      value1: 'Hello',
      value2: 'World',
    })

    function ChildComponent() {
      const { value1, value2 } = use()

      return (
        <div>
          <span>{value1}</span>
          <span>{value2}</span>
        </div>
      )
    }

    render(
      <Provider value={{ value1: 'Hello', value2: 'World' }}>
        <ChildComponent />
      </Provider>
    )

    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('World')).toBeInTheDocument()
  })

  it('should reponse to value changes', async () => {
    let appRenderTimes = 0
    let readerRenderTimes = 0
    let writerRenderTimes = 0

    const { Provider, use } = createSplitedContext({
      value: 0,
      setValue: (_: any) => {},
    })

    function ReaderComponent() {
      const { value } = use()

      useEffect(() => {
        readerRenderTimes++
      }, [value])

      return <div>{value}</div>
    }

    ReaderComponent.whyDidYouRender = true

    function WriterComponent() {
      const { setValue } = use()

      useEffect(() => {
        writerRenderTimes++
      }, [setValue])

      return (
        <button type='button' onClick={() => setValue((p: number) => p + 1)}>
          Change
        </button>
      )
    }

    WriterComponent.whyDidYouRender = true

    const App = memo(() => {
      appRenderTimes++

      return (
        <>
          <ReaderComponent />
          <WriterComponent />
        </>
      )
    })

    function Container() {
      const [value, setValue] = useState(0)

      return (
        <Provider value={{ value, setValue }}>
          <App />
        </Provider>
      )
    }

    Container.whyDidYouRender = true

    const user = userEvent.setup()

    render(<Container />)

    expect(screen.getByText('0')).toBeInTheDocument()

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('button'))

    expect(screen.getByText('2')).toBeInTheDocument()
    expect(appRenderTimes).toBe(1)
    expect(readerRenderTimes).toBe(3)
    expect(writerRenderTimes).toBe(1)
  })
})
