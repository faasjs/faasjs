import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import type { FaasItemType } from '../../data'
import { Form } from '../../Form'
import { FormItem } from '../../FormItem'

type ListCase = {
  inputClassName: string
  primitiveName: string
  type: Extract<FaasItemType, 'number[]' | 'string[]'>
}

const cases: ListCase[] = [
  {
    inputClassName: 'ant-input',
    primitiveName: 'string',
    type: 'string[]',
  },
  {
    inputClassName: 'ant-input-number-input',
    primitiveName: 'number',
    type: 'number[]',
  },
]

describe('FormItem list types', () => {
  it.each(cases)('$type with object options', async ({ type }) => {
    const user = userEvent.setup()
    const { container } = render(
      <Form>
        <FormItem
          id="test"
          type={type}
          options={[
            {
              label: 'label',
              value: 'value',
            },
          ]}
        />
      </Form>,
    )

    expect(container.getElementsByClassName('ant-select').length).toEqual(1)

    await user.click(container.getElementsByClassName('ant-select')[0])

    expect(await screen.findByText('label')).toBeDefined()
  })

  it.each(cases)('$type with $primitiveName options', async ({ type }) => {
    const user = userEvent.setup()
    const { container } = render(
      <Form>
        <FormItem id="test" type={type} options={['value']} />
      </Form>,
    )

    expect(container.getElementsByClassName('ant-select').length).toEqual(1)

    await user.click(container.getElementsByClassName('ant-select')[0])

    expect(await screen.findByText('Value')).toBeDefined()
  })

  describe('can add', () => {
    it.each(cases)('$type without maxCount', async ({ inputClassName, type }) => {
      const user = userEvent.setup()
      const { container } = render(
        <Form>
          <FormItem id="test" type={type} />
        </Form>,
      )

      await user.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(container.getElementsByClassName(inputClassName).length).toEqual(1)

      await user.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(container.getElementsByClassName(inputClassName).length).toEqual(2)
      expect(container.getElementsByClassName('ant-btn-dashed').length).toEqual(1)
    })

    it.each(cases)('$type with maxCount', async ({ inputClassName, type }) => {
      const user = userEvent.setup()
      const { container } = render(
        <Form>
          <FormItem id="test" type={type} maxCount={2} />
        </Form>,
      )

      await user.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(container.getElementsByClassName(inputClassName).length).toEqual(1)

      await user.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(container.getElementsByClassName(inputClassName).length).toEqual(2)
      expect(container.getElementsByClassName('ant-btn-dashed').length).toEqual(0)
    })
  })

  describe('can delete', () => {
    it.each(cases)('$type without required', async ({ inputClassName, type }) => {
      const user = userEvent.setup()
      const { container } = render(
        <Form>
          <FormItem id="test" type={type} />
        </Form>,
      )

      await user.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(container.getElementsByClassName('anticon-minus-circle').length).toEqual(1)
      expect(container.getElementsByClassName(inputClassName).length).toEqual(1)

      await user.click(container.getElementsByClassName('anticon-minus-circle')[0])

      expect(container.getElementsByClassName('anticon-minus-circle').length).toEqual(0)
      expect(container.getElementsByClassName(inputClassName).length).toEqual(0)
    })

    it.each(cases)('$type with required', async ({ inputClassName, type }) => {
      const user = userEvent.setup()
      const { container } = render(
        <Form>
          <FormItem id="test" type={type} required />
        </Form>,
      )

      await user.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(container.getElementsByClassName('anticon-minus-circle').length).toEqual(0)
      expect(container.getElementsByClassName(inputClassName).length).toEqual(1)

      await user.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(container.getElementsByClassName('anticon-minus-circle').length).toEqual(1)
      expect(container.getElementsByClassName(inputClassName).length).toEqual(2)

      await user.click(container.getElementsByClassName('anticon-minus-circle')[0])

      expect(container.getElementsByClassName('anticon-minus-circle').length).toEqual(0)
      expect(container.getElementsByClassName(inputClassName).length).toEqual(1)
    })
  })
})
