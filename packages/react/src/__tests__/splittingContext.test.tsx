/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createSplittingContext } from '../splittingContext'
import { useEffect, useState } from 'react'

describe('createSplittingContext', () => {
  it('should render children with default values', () => {
    let renderTimes = 0

    const { Provider, use } = createSplittingContext({
      value1: 'Hello',
      value2: 'World',
    })

    function ChildComponent() {
      const { value1, value2 } = use()

      renderTimes++

      return (
        <div>
          <span>{value1}</span>
          <span>{value2}</span>
        </div>
      )
    }

    render(
      <Provider>
        <ChildComponent />
      </Provider>
    )

    expect(screen.getByText('Hello')).toBeDefined()
    expect(screen.getByText('World')).toBeDefined()
    expect(renderTimes).toBe(1)
  })

  it('should render children with provided values', () => {
    let renderTimes = 0
    const { Provider, use } = createSplittingContext<{
      value: {
        value1: string
        value2: string
      }
    }>({
      value: null,
    })

    function ChildComponent() {
      const { value } = use()

      renderTimes++

      return (
        <div>
          <span>{value.value1}</span>
          <span>{value.value2}</span>
        </div>
      )
    }

    render(
      <Provider value={{ value: { value1: 'value1', value2: 'value2' } }}>
        <ChildComponent />
      </Provider>
    )

    expect(screen.getByText('value1')).toBeDefined()
    expect(screen.getByText('value2')).toBeDefined()
    expect(renderTimes).toBe(1)
  })

  it('should response to value changes', async () => {
    let containerRenderTimes = 0
    let readerRenderTimes = 0
    let writerRenderTimes = 0

    const { Provider, use } = createSplittingContext<{
      value: number
      setValue: React.Dispatch<React.SetStateAction<number>>
      optional: string
    }>({
      value: 0,
      setValue: undefined,
      optional: 'optional',
    })

    function ReaderComponent() {
      const { value } = use()

      useEffect(() => {
        readerRenderTimes++
      }, [value])

      return <div>reader:{value}</div>
    }

    ReaderComponent.whyDidYouRender = true

    function WriterComponent() {
      const { setValue, optional } = use()

      useEffect(() => {
        writerRenderTimes++
      }, [setValue])

      return (
        <>
          <button type='button' onClick={() => setValue((p: number) => p + 1)}>
            Change
          </button>
          <div>writer:{optional}</div>
        </>
      )
    }

    WriterComponent.whyDidYouRender = true

    function Container() {
      const [value, setValue] = useState(0)

      containerRenderTimes++

      return (
        <Provider value={{ value, setValue }}>
          <ReaderComponent />
          <WriterComponent />
          parent:{value}
        </Provider>
      )
    }

    Container.whyDidYouRender = true

    const user = userEvent.setup()

    render(<Container />)

    expect(screen.getByText('reader:0')).toBeDefined()
    expect(screen.getByText('writer:optional')).toBeDefined()

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('button'))

    expect(screen.getByText('reader:2')).toBeDefined()
    expect(screen.getByText('parent:2')).toBeDefined()
    expect(containerRenderTimes).toBe(3)
    expect(readerRenderTimes).toBe(3)
    expect(writerRenderTimes).toBe(1)
  })
})
