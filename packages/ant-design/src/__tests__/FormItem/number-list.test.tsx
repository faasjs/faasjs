import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Form } from '../../Form'
import { FormItem } from '../../FormItem'

describe('FormItem number[]', () => {
  it('with object options', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Form>
        <FormItem
          id='test'
          type='number[]'
          options={[
            {
              label: 'label',
              value: 'value',
            },
          ]}
        />
      </Form>
    )

    expect(container.getElementsByClassName('ant-select').length).toEqual(1)

    await user.click(container.getElementsByClassName('ant-select')[0])

    expect(await screen.findByText('label')).toBeDefined()
  })

  it('with number options', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Form>
        <FormItem id='test' type='number[]' options={['value']} />
      </Form>
    )

    expect(container.getElementsByClassName('ant-select').length).toEqual(1)

    await user.click(container.getElementsByClassName('ant-select')[0])

    expect(await screen.findByText('Value')).toBeDefined()
  })

  describe('can add', () => {
    it('without maxCount', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <Form>
          <FormItem id='test' type='number[]' />
        </Form>
      )

      await user.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(
        container.getElementsByClassName('ant-input-number-input').length
      ).toEqual(1)

      await user.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(
        container.getElementsByClassName('ant-input-number-input').length
      ).toEqual(2)
      expect(container.getElementsByClassName('ant-btn-dashed').length).toEqual(
        1
      )
    })

    it('with maxCount', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <Form>
          <FormItem id='test' type='number[]' maxCount={2} />
        </Form>
      )

      await user.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(
        container.getElementsByClassName('ant-input-number-input').length
      ).toEqual(1)

      await user.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(
        container.getElementsByClassName('ant-input-number-input').length
      ).toEqual(2)
      expect(container.getElementsByClassName('ant-btn-dashed').length).toEqual(
        0
      )
    })
  })

  describe('can delete', () => {
    it('without required', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <Form>
          <FormItem id='test' type='number[]' />
        </Form>
      )

      await user.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(
        container.getElementsByClassName('anticon-minus-circle').length
      ).toEqual(1)
      expect(
        container.getElementsByClassName('ant-input-number-input').length
      ).toEqual(1)

      await user.click(
        container.getElementsByClassName('anticon-minus-circle')[0]
      )

      expect(
        container.getElementsByClassName('anticon-minus-circle').length
      ).toEqual(0)
      expect(
        container.getElementsByClassName('ant-input-number-input').length
      ).toEqual(0)
    })

    it('with required', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <Form>
          <FormItem id='test' type='number[]' required />
        </Form>
      )

      await user.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(
        container.getElementsByClassName('anticon-minus-circle').length
      ).toEqual(0)
      expect(
        container.getElementsByClassName('ant-input-number-input').length
      ).toEqual(1)

      await user.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(
        container.getElementsByClassName('anticon-minus-circle').length
      ).toEqual(1)
      expect(
        container.getElementsByClassName('ant-input-number-input').length
      ).toEqual(2)

      await user.click(
        container.getElementsByClassName('anticon-minus-circle')[0]
      )

      expect(
        container.getElementsByClassName('anticon-minus-circle').length
      ).toEqual(0)
      expect(
        container.getElementsByClassName('ant-input-number-input').length
      ).toEqual(1)
    })
  })
})
