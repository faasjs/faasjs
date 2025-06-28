import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { FaasItemType } from '../../data'
import { Form } from '../../Form'
import { FormItem } from '../../FormItem'

describe('FormItem', () => {
  const types: Exclude<FaasItemType, 'object' | 'object[]'>[] = [
    'string',
    'string[]',
    'number',
    'number[]',
    'boolean',
    'date',
    'time',
  ]

  describe('label', () => {
    it.each(types)('%s should show', type => {
      const { container } = render(<FormItem id='test' type={type} />)

      expect(screen.getByText('Test')).toBeDefined()
      expect(
        container.getElementsByClassName('ant-form-item-label').length
      ).toEqual(1)
    })

    it.each(types)('%s should hide', type => {
      const { container } = render(
        <FormItem id='test' type={type} label={false} />
      )

      expect(screen.queryByText('Test')).toBeNull()
      expect(
        container.getElementsByClassName('ant-form-item-label').length
      ).toEqual(0)
    })
  })

  describe('required', () => {
    it.each(types)('%s should required', async type => {
      const user = userEvent.setup()
      const { container } = render(
        <Form
          items={[
            {
              id: 'test',
              type,
              required: true,
            },
          ]}
        />
      )

      expect(
        container.getElementsByClassName('ant-form-item-required').length
      ).toEqual(1)

      await user.click(container.getElementsByClassName('ant-btn-primary')[0])

      expect(await screen.findByText('Test is required')).toBeDefined()
    })
  })

  it('hidden', () => {
    const { container } = render(
      <Form
        items={[
          {
            id: 'test',
            type: 'string',
            if: () => false,
          },
        ]}
      />
    )

    expect(container.querySelectorAll('input[type="hidden"]')).toHaveLength(1)
  })
})
