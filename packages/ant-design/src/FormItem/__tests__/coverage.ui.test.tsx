import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Form } from '../../Form'
import { FormItem } from '../../FormItem'

describe('FormItem/coverage', () => {
  it('should show required error and render input', async () => {
    const user = userEvent.setup()
    const { container } = render(<Form items={[{ id: 'name', required: true }]} />)

    expect(screen.getByText('Name')).toBeDefined()
    expect(container.getElementsByClassName('ant-form-item-required').length).toEqual(1)
    expect(screen.getByRole('textbox')).toBeDefined()

    await user.click(container.getElementsByClassName('ant-btn-primary')[0])

    expect(await screen.findByText('Name is required')).toBeDefined()
  })

  it('should show required error for array type and render extras', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Form
        initialValues={{ tags: [] }}
        items={[{ id: 'tags', type: 'string[]', required: true, extra: 'Hint' }]}
      />,
    )

    expect(screen.getByText('Tags')).toBeDefined()
    expect(screen.getByText('Hint')).toBeDefined()
    expect(container.getElementsByClassName('ant-form-item-required').length).toEqual(1)

    await user.click(container.getElementsByClassName('ant-btn-primary')[0])

    expect(await screen.findByText('Tags is required')).toBeDefined()
  })

  it('should use select inputs for large option sets', () => {
    const { container, rerender } = render(
      <FormItem
        id="status"
        type="string"
        options={Array.from({ length: 11 }, (_, index) => `opt-${index}`)}
      />,
    )

    expect(container.querySelector('.ant-select')).toBeDefined()

    rerender(
      <FormItem
        id="count"
        type="number"
        options={Array.from({ length: 11 }, (_, index) => index)}
      />,
    )

    expect(container.querySelector('.ant-select')).toBeDefined()
  })

  it('should return null for null children and render custom content', () => {
    const hidden = render(<FormItem id="skip">{null}</FormItem>)

    expect(hidden.container.innerHTML).toBe('')

    render(<FormItem id="custom" render={() => <span>custom-render</span>} />)

    expect(screen.getByText('custom-render')).toBeDefined()
  })

  it('should hide and show fields based on if condition', async () => {
    const user = userEvent.setup()

    render(<Form items={[{ id: 'visible' }, { id: 'secret', if: (values) => !!values.visible }]} />)

    expect(screen.queryByText('Secret')).toBeNull()

    await user.type(screen.getByRole('textbox'), 'yes')

    expect(await screen.findByText('Secret')).toBeDefined()
  })

  it('should render object label and object array controls', async () => {
    render(<FormItem id="profile" type="object" label="Profile" required object={[]} />)

    expect(await screen.findByText('Profile')).toBeDefined()
    expect(document.querySelector('.ant-form-item-required')).not.toBeNull()

    render(
      <Form
        initialValues={{ addresses: [{}] }}
        items={[
          {
            id: 'addresses',
            type: 'object[]',
            label: 'Addresses',
            extra: 'More addresses',
            maxCount: 2,
            object: [{ id: 'line1' }],
          },
        ]}
      />,
    )

    expect(screen.getByText('Addresses 1')).toBeDefined()
    expect(screen.getByText('Delete')).toBeDefined()
    expect(screen.getByText('Add Addresses')).toBeDefined()
    expect(screen.getByText('More addresses')).toBeDefined()
  })
})
