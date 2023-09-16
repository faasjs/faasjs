/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FaasItemType } from '../../data'
import { FormItem } from '../../FormItem'
import { Form } from '../../Form'

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

      expect(screen.getByText('Test')).toBeInTheDocument()
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

      expect(await screen.findByText('Test is required')).toBeInTheDocument()
    })
  })
})
