/**
 * @jest-environment @happy-dom/jest-environment
 */
import { render, fireEvent } from '@testing-library/react'
import { FormButtonElement } from '../Button'
import { createRef } from 'react'

describe('FormButtonElement', () => {
  it('renders correctly', () => {
    const { getByText } = render(<FormButtonElement>Click Me</FormButtonElement>)
    expect(getByText('Click Me')).not.toBeNull()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    const { getByText } = render(
      <FormButtonElement submit={handleClick}>Click Me</FormButtonElement>
    )
    fireEvent.click(getByText('Click Me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when the disabled prop is true', () => {
    const { getByText } = render(
      <FormButtonElement disabled>Click Me</FormButtonElement>
    )
    expect((getByText('Click Me') as HTMLButtonElement).disabled).toBeTruthy()
  })

  it('forwards refs correctly', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<FormButtonElement ref={ref}>Click Me</FormButtonElement>)
    expect(ref.current).not.toBeNull()
  })
})
