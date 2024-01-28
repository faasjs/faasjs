/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect } from 'react'
import { App, useApp } from '../../App'

describe('App', () => {
  it('should work', async () => {
    let count = 0
    function Component() {
      const { setModalProps, message } = useApp()

      // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
      useEffect(() => {
        message.info('Hi')
      }, [])

      count++

      return (
        <button
          type='button'
          onClick={() =>
            setModalProps({
              open: true,
              title: 'Hello',
            })
          }
        >
          Component
        </button>
      )
    }

    Component.whyDidYouRender = true

    const user = userEvent.setup()

    render(
      <App>
        <Component />
      </App>
    )

    expect(screen.getByText('Hi')).toBeInTheDocument()
    expect(count).toBe(2)

    await user.click(screen.getByRole('button'))

    expect(await screen.findByText('Hello')).toBeInTheDocument()
    expect(count).toBe(3)
  })
})
