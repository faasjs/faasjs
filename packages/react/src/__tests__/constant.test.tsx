/**
 * @jest-environment jsdom
 */
import { useState } from 'react'
import { useConstant } from '../constant'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('useConstant', () => {
  it('should work', async () => {
    const fn = jest.fn(() => 'test')

    function Test() {
      const data = useConstant(fn)
      const [times, setTimes] = useState(0)

      return (
        <button type='button' onClick={() => setTimes(p => p + 1)}>
          {times} {data}
        </button>
      )
    }
    const user = userEvent.setup()

    render(<Test />)

    expect(fn).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button'))

    expect(fn).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('1 test')).toBeInTheDocument()
  })
})
