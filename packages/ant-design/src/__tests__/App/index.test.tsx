/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App, useApp } from '../../App'

describe('App', () => {
  it('should work', async () => {
    function Component () {
      const { setModalProps } = useApp()

      return <button onClick={ () => setModalProps({
        open: true,
        title: 'Hello',
      }) }>Component</button>
    }

    const user = userEvent.setup()

    render(<App>
      <Component />
    </App>)

    await user.click(screen.getByRole('button'))

    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
