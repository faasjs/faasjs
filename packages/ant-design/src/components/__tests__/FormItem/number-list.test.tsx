/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from '../../Form'
import { FormItem } from '../../FormItem'

describe('FormItem number[]', () => {
  it('with object options', async () => {
    const { container } = render(<FormItem
      id='test'
      type='number[]'
      options={ [
        {
          label: 'label',
          value: 'value'
        }
      ] }
    />)

    expect(container.getElementsByClassName('ant-select-selector').length).toEqual(1)

    userEvent.click(container.getElementsByClassName('ant-select-selector')[0])

    expect(await screen.findByText('label')).toBeInTheDocument()
  })

  it('with number options', async () => {
    const { container } = render(<FormItem
      id='test'
      type='number[]'
      options={ ['value'] }
    />)

    expect(container.getElementsByClassName('ant-select-selector').length).toEqual(1)

    userEvent.click(container.getElementsByClassName('ant-select-selector')[0])

    expect(await screen.findByText('Value')).toBeInTheDocument()
  })

  it('can add', () => {
    const { container } = render(<Form>
      <FormItem
        id='test'
        type='number[]'
      />
    </Form>)

    userEvent.click(container.getElementsByClassName('ant-btn-dashed')[0])

    expect(container.getElementsByClassName('ant-input-number-input').length).toEqual(1)

    userEvent.click(container.getElementsByClassName('ant-btn-dashed')[0])

    expect(container.getElementsByClassName('ant-input-number-input').length).toEqual(2)
  })

  describe('can delete', () => {
    it('without required', () => {
      const { container } = render(<Form>
        <FormItem
          id='test'
          type='number[]'
        />
      </Form>)

      userEvent.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(container.getElementsByClassName('anticon-minus-circle').length).toEqual(1)
      expect(container.getElementsByClassName('ant-input-number-input').length).toEqual(1)

      userEvent.click(container.getElementsByClassName('anticon-minus-circle')[0])

      expect(container.getElementsByClassName('anticon-minus-circle').length).toEqual(0)
      expect(container.getElementsByClassName('ant-input-number-input').length).toEqual(0)
    })

    it('with required', () => {
      const { container } = render(<Form>
        <FormItem
          id='test'
          type='number[]'
          required
        />
      </Form>)

      userEvent.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(container.getElementsByClassName('anticon-minus-circle').length).toEqual(0)
      expect(container.getElementsByClassName('ant-input-number-input').length).toEqual(1)

      userEvent.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(container.getElementsByClassName('anticon-minus-circle').length).toEqual(1)
      expect(container.getElementsByClassName('ant-input-number-input').length).toEqual(2)

      userEvent.click(container.getElementsByClassName('anticon-minus-circle')[0])

      expect(container.getElementsByClassName('anticon-minus-circle').length).toEqual(0)
      expect(container.getElementsByClassName('ant-input-number-input').length).toEqual(1)
    })
  })
})
