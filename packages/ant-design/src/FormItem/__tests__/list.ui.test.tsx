import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import type { FaasItemType } from '../../data'
import { Form } from '../../Form'
import { FormItem } from '../../FormItem'
import type { FormItemProps } from '../types'

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

function renderListItem(props: Omit<FormItemProps, 'id'>) {
  const user = userEvent.setup()
  const view = render(
    <Form>
      <FormItem id="test" {...props} />
    </Form>,
  )
  const count = (className: string) => view.container.getElementsByClassName(className).length
  const clickByClassName = (className: string) =>
    user.click(view.container.getElementsByClassName(className)[0])

  return {
    ...view,
    clickAdd: () => clickByClassName('ant-btn-dashed'),
    clickRemove: () => clickByClassName('anticon-minus-circle'),
    clickSelect: () => clickByClassName('ant-select'),
    count,
  }
}

describe('FormItem list types', () => {
  it.each(cases)('$type with object options', async ({ type }) => {
    const { clickSelect, count } = renderListItem({
      options: [
        {
          label: 'label',
          value: 'value',
        },
      ],
      type,
    })

    expect(count('ant-select')).toEqual(1)

    await clickSelect()

    expect(await screen.findByText('label')).toBeDefined()
  })

  it.each(cases)('$type with $primitiveName options', async ({ type }) => {
    const { clickSelect, count } = renderListItem({
      options: ['value'],
      type,
    })

    expect(count('ant-select')).toEqual(1)

    await clickSelect()

    expect(await screen.findByText('Value')).toBeDefined()
  })

  describe('can add', () => {
    it.each(
      cases.flatMap((item) => [
        { ...item, expectedAddButtonCount: 1, name: 'without maxCount', props: {} },
        { ...item, expectedAddButtonCount: 0, name: 'with maxCount', props: { maxCount: 2 } },
      ]),
    )('$type $name', async ({ expectedAddButtonCount, inputClassName, props, type }) => {
      const { clickAdd, count } = renderListItem({
        ...props,
        type,
      })

      await clickAdd()

      expect(count(inputClassName)).toEqual(1)

      await clickAdd()

      expect(count(inputClassName)).toEqual(2)
      expect(count('ant-btn-dashed')).toEqual(expectedAddButtonCount)
    })
  })

  describe('can delete', () => {
    it.each(cases)('$type without required', async ({ inputClassName, type }) => {
      const { clickAdd, clickRemove, count } = renderListItem({
        type,
      })

      await clickAdd()

      expect(count('anticon-minus-circle')).toEqual(1)
      expect(count(inputClassName)).toEqual(1)

      await clickRemove()

      expect(count('anticon-minus-circle')).toEqual(0)
      expect(count(inputClassName)).toEqual(0)
    })

    it.each(cases)('$type with required', async ({ inputClassName, type }) => {
      const { clickAdd, clickRemove, count } = renderListItem({
        required: true,
        type,
      })

      await clickAdd()

      expect(count('anticon-minus-circle')).toEqual(0)
      expect(count(inputClassName)).toEqual(1)

      await clickAdd()

      expect(count('anticon-minus-circle')).toEqual(1)
      expect(count(inputClassName)).toEqual(2)

      await clickRemove()

      expect(count('anticon-minus-circle')).toEqual(0)
      expect(count(inputClassName)).toEqual(1)
    })
  })
})
