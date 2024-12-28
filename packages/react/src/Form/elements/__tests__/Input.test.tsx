import { fireEvent, render } from '@testing-library/react'
import { vi } from 'vitest'
import { FormInputElement } from '../Input'

describe('FormInputElement', () => {
  it('renders input element and handles change', () => {
    const handleChange = vi.fn()
    const { getByRole } = render(
      <FormInputElement name='test' value='initial' onChange={handleChange} />
    )
    const input = getByRole('textbox') as HTMLInputElement

    expect(input.value).toBe('initial')

    fireEvent.change(input, { target: { value: 'changed' } })
    expect(handleChange).toHaveBeenCalledWith('changed')
  })
})
