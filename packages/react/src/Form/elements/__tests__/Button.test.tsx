import { fireEvent, render } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { FormButtonElement } from '../Button'

describe('FormButtonElement', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <FormButtonElement submitting={false} submit={async () => undefined}>
        Click Me
      </FormButtonElement>
    )
    expect(getByText('Click Me')).not.toBeNull()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()

    const { getByText } = render(
      <FormButtonElement submitting={false} submit={handleClick}>
        Click Me
      </FormButtonElement>
    )
    fireEvent.click(getByText('Click Me'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when the disabled prop is true', () => {
    const { getByText } = render(
      <FormButtonElement submitting submit={async () => undefined}>
        Click Me
      </FormButtonElement>
    )

    expect((getByText('Click Me') as HTMLButtonElement).disabled).toBeTruthy()
  })

  it('forwards refs correctly', () => {
    const ref = createRef<HTMLButtonElement>()

    render(
      <FormButtonElement
        ref={ref}
        submitting={false}
        submit={async () => undefined}
      >
        Click Me
      </FormButtonElement>
    )

    expect(ref.current).not.toBeNull()
  })
})
