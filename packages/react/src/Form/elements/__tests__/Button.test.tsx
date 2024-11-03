/**
 * @jest-environment @happy-dom/jest-environment
 */

import { fireEvent, render } from '@testing-library/react'
import { createRef } from 'react'
import { FormButtonElement } from '../Button'

describe('FormButtonElement', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <FormButtonElement disabled={false} submit={() => 1}>Click Me</FormButtonElement>
    )
    expect(getByText('Click Me')).not.toBeNull()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()

    const { getByText } = render(
      <FormButtonElement disabled={false} submit={handleClick}>Click Me</FormButtonElement>
    )
    fireEvent.click(getByText('Click Me'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when the disabled prop is true', () => {
    const { getByText } = render(
      <FormButtonElement disabled submit={() => 1}>Click Me</FormButtonElement>
    )

    expect((getByText('Click Me') as HTMLButtonElement).disabled).toBeTruthy()
  })

  it('forwards refs correctly', () => {
    const ref = createRef<HTMLButtonElement>()

    render(<FormButtonElement ref={ref} disabled={false} submit={() => 1}>Click Me</FormButtonElement>)

    expect(ref.current).not.toBeNull()
  })
})
