/**
 * @jest-environment @happy-dom/jest-environment
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from '../../Form'
import { FormItem } from '../../FormItem'

describe('FormItem number[]', () => {
  it('with object options', async () => {
    const user = userEvent.setup()
    const { container } = render(
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
    )

    expect(
      container.getElementsByClassName('ant-select-selector').length
    ).toEqual(1)

    await user.click(container.getElementsByClassName('ant-select-selector')[0])

    expect(await screen.findByText('label')).toBeDefined()
  })

  it('with number options', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <FormItem id='test' type='number[]' options={['value']} />
    )

    expect(
      container.getElementsByClassName('ant-select-selector').length
    ).toEqual(1)

    await user.click(container.getElementsByClassName('ant-select-selector')[0])

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
