/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect } from 'react'
import { App, useApp } from '../../App'

describe('App', () => {
  it('should work', async () => {
    let ContainerTimes = 0
    let ButtonTimes = 0
    let ComponentTimes = 0

    function Container() {
      ContainerTimes++

      return (
        <>
          <Component />
          <Button />
        </>
      )
    }

    Container.whyDidYouRender = true

    function Button() {
      const { setModalProps, setDrawerProps } = useApp()

      ButtonTimes++

      return (
        <button
          type='button'
          onClick={() => {
            setDrawerProps({
              open: true,
              title: 'Hi Drawer',
            })
            setModalProps({
              open: true,
              title: 'Hi Modal',
            })
          }}
        >
          Button
        </button>
      )
    }

    Button.whyDidYouRender = true

    function Component() {
      const { message } = useApp()

      // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
      useEffect(() => {
        message.info('Hi')
      }, [])

      ComponentTimes++

      return <div>Component</div>
    }

    Component.whyDidYouRender = true

    const user = userEvent.setup()

    render(
      <App>
        <Container />
      </App>
    )

    expect(screen.getByText('Hi')).toBeInTheDocument()
    expect(ContainerTimes).toBe(1)
    expect(ButtonTimes).toBe(1)
    expect(ComponentTimes).toBe(1)

    await user.click(screen.getByRole('button'))

    expect(await screen.findByText('Hi Drawer')).toBeInTheDocument()
    expect(await screen.findByText('Hi Modal')).toBeInTheDocument()
    expect(ContainerTimes).toBe(1)
    expect(ButtonTimes).toBe(1)
    expect(ComponentTimes).toBe(1)
  })
})
