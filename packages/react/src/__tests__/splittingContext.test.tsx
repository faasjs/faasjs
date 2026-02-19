import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { assertType, describe, expect, it } from 'vitest'
import { createSplittingContext } from '../splittingContext'

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
      </Provider>,
    )

    expect(screen.getByText('Hello')).not.toBeNull()
    expect(screen.getByText('World')).not.toBeNull()
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
      </Provider>,
    )

    expect(screen.getByText('value1')).not.toBeNull()
    expect(screen.getByText('value2')).not.toBeNull()
    expect(renderTimes).toBe(1)
  })

  it('should response to value changes', async () => {
    let containerRenderTimes = 0
    let readerRenderTimes = 0
    let writerRenderTimes = 0

    const { Provider, use } = createSplittingContext<{
      value: number
      setValue: React.Dispatch<React.SetStateAction<number>>
      optional?: string
    }>({
      value: 0,
      setValue: null,
      optional: 'optional',
    })

    function ReaderComponent() {
      const { value } = use()

      readerRenderTimes++

      return <div>reader:{value}</div>
    }

    function WriterComponent() {
      const { setValue, optional } = use()

      writerRenderTimes++

      return (
        <>
          <button type='button' onClick={() => setValue((p: number) => p + 1)}>
            Change
          </button>
          <div>writer:{optional}</div>
        </>
      )
    }

    function Container() {
      const [value, setValue] = useState(0)

      containerRenderTimes++

      return (
        <Provider value={{ value, setValue }} memo>
          <ReaderComponent />
          <WriterComponent />
        </Provider>
      )
    }

    const user = userEvent.setup()

    render(<Container />)

    expect(screen.getByText('reader:0')).not.toBeNull()
    expect(screen.getByText('writer:optional')).not.toBeNull()

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('button'))

    expect(screen.getByText('reader:2')).not.toBeNull()
    expect(containerRenderTimes).toBe(3)
    expect(readerRenderTimes).toBe(3)
    expect(writerRenderTimes).toBe(1)
  })

  it('should accept array of keys', () => {
    const { Provider, use } = createSplittingContext<{
      value1: string
      value2: string
    }>(['value1', 'value2'])

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
      </Provider>,
    )

    expect(screen.getByText('Hello')).not.toBeNull()
    expect(screen.getByText('World')).not.toBeNull()
  })

  it('should handle initializeStates', async () => {
    let readerRenderTimes = 0
    let writerRenderTimes = 0

    const { Provider, use } = createSplittingContext<{
      count: number
      setCount: React.Dispatch<React.SetStateAction<number>>
      name: string
      setName: React.Dispatch<React.SetStateAction<string>>
    }>(['count', 'setCount', 'name', 'setName'])

    function ReaderComponent() {
      const { count, name } = use()
      readerRenderTimes++

      return (
        <div>
          count:{count} name:{name}
        </div>
      )
    }

    function WriterComponent() {
      const { setCount, setName } = use()
      writerRenderTimes++

      return (
        <>
          <button type='button' onClick={() => setCount((c) => c + 1)}>
            Increment
          </button>
          <button type='button' onClick={() => setName('Alice')}>
            Change Name
          </button>
        </>
      )
    }

    const user = userEvent.setup()

    render(
      <Provider
        initializeStates={{
          count: 0,
          name: 'Bob',
        }}
        memo
      >
        <ReaderComponent />
        <WriterComponent />
      </Provider>,
    )

    expect(screen.getByText('count:0 name:Bob')).not.toBeNull()

    await user.click(screen.getByText('Increment'))
    expect(screen.getByText('count:1 name:Bob')).not.toBeNull()

    await user.click(screen.getByText('Change Name'))
    expect(screen.getByText('count:1 name:Alice')).not.toBeNull()

    expect(readerRenderTimes).toBe(3)
    expect(writerRenderTimes).toBe(1)
  })

  it('should combine initializeStates with value prop', () => {
    const { Provider, use } = createSplittingContext<{
      count: number
      setCount: React.Dispatch<React.SetStateAction<number>>
      name: string
    }>(['count', 'setCount', 'name'])

    function Component() {
      const { count, name } = use()
      return (
        <div>
          count:{count} name:{name}
        </div>
      )
    }

    render(
      <Provider initializeStates={{ count: 0 }} value={{ name: 'Bob' }}>
        <Component />
      </Provider>,
    )

    expect(screen.getByText('count:0 name:Bob')).not.toBeNull()
  })

  it('should accept new type of provider', () => {
    const { Provider, use } = createSplittingContext<{
      value: Record<string, any>
      setValue: React.Dispatch<React.SetStateAction<any>>
    }>(['value', 'setValue'])

    assertType<React.ReactNode>(
      Provider<{
        value: { a: number }
        setValue: React.Dispatch<React.SetStateAction<{ a: number }>>
      }>({ value: { value: { a: 1 }, setValue: () => 1 }, children: null }),
    )
    assertType<
      () => {
        value: { a: number }
        setValue: React.Dispatch<React.SetStateAction<{ a: number }>>
      }
    >(
      use<{
        value: { a: number }
        setValue: React.Dispatch<React.SetStateAction<{ a: number }>>
      }>,
    )
  })
})
