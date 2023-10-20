/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect } from 'react'
import { App, useApp } from '../../App'

describe('App', () => {
  it('should work', async () => {
    function Component() {
      const { setModalProps, message } = useApp()

      // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
      useEffect(() => {
        message.info('Hi')
      }, [])

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

    const user = userEvent.setup()

    render(
      <App>
        <Component />
      </App>
    )

    expect(screen.getByText('Hi')).toBeInTheDocument()

    await user.click(screen.getByRole('button'))

    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
