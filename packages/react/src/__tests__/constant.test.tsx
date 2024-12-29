import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { vi } from 'vitest'
import { useConstant } from '../constant'

describe('useConstant', () => {
  it('should work', async () => {
    const fn = vi.fn(() => 'test')

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
    expect(await screen.findByText('1 test')).toBeDefined()
  })
})
