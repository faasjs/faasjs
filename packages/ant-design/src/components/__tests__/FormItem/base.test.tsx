/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { FaasItemType } from '../../data'
import { FormItem } from '../../FormItem'

describe('FormItem', () => {
  const types: FaasItemType[] = [
    'string',
    'string[]',
    'number',
    'number[]',
    'boolean',
  ]

  describe('label', () => {
    it.each(types)('%s should show', (type) => {
      const { container } = render(<FormItem
        id='test'
        type={ type }
      />)

      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(container.getElementsByClassName('ant-form-item-label').length).toEqual(1)
    })

    it.each(types)('%s should hide', (type) => {
      const { container } = render(<FormItem
        id='test'
        type={ type }
        label={ false }
      />)

      expect(screen.queryByText('Test')).toBeNull()
      expect(container.getElementsByClassName('ant-form-item-label').length).toEqual(0)
    })
  })
})
