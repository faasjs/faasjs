import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import type { FaasItemType } from '../../data'
import { FormItem } from '../../FormItem'

describe('FormItem scalar types', () => {
  it.each<Extract<FaasItemType, 'number' | 'string'>>(['string', 'number'])(
    '%s with options',
    async (type) => {
      const user = userEvent.setup()
      const { container } = render(
        <FormItem
          id="test"
          type={type}
          options={[
            {
              label: 'label',
              value: 'value',
            },
          ]}
        />,
      )

      expect(container.getElementsByClassName('ant-radio-input').length).toEqual(1)

      await user.click(container.getElementsByClassName('ant-radio-input')[0])

      expect(await screen.findByText('label')).toBeDefined()
    },
  )

  it.each<Extract<FaasItemType, 'date' | 'time'>>(['date', 'time'])('%s renders picker', (type) => {
    const { container } = render(<FormItem id="test" type={type} />)

    expect(container.getElementsByClassName('ant-picker').length).toEqual(1)
  })
})
