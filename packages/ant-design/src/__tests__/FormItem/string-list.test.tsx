/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from '../../Form'
import { FormItem } from '../../FormItem'

describe('FormItem string[]', () => {
  it('with object options', async () => {
    const { container } = render(<FormItem
      id='test'
      type='string[]'
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

  it('with string options', async () => {
    const { container } = render(<FormItem
      id='test'
      type='string[]'
      options={ ['value'] }
    />)

    expect(container.getElementsByClassName('ant-select-selector').length).toEqual(1)

    userEvent.click(container.getElementsByClassName('ant-select-selector')[0])

    expect(await screen.findByText('Value')).toBeInTheDocument()
  })

  describe('can add', () => {
    it('without maxCount', () => {
      const { container } = render(<Form>
        <FormItem
          id='test'
          type='string[]'
        />
      </Form>)

      userEvent.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(container.getElementsByClassName('ant-input').length).toEqual(1)

      userEvent.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(container.getElementsByClassName('ant-input').length).toEqual(2)
      expect(container.getElementsByClassName('ant-btn-dashed').length).toEqual(1)
    })

    it('with maxCount', () => {
      const { container } = render(<Form>
        <FormItem
          id='test'
          type='string[]'
          maxCount={ 2 }
        />
      </Form>)

      userEvent.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(container.getElementsByClassName('ant-input').length).toEqual(1)

      userEvent.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(container.getElementsByClassName('ant-input').length).toEqual(2)
      expect(container.getElementsByClassName('ant-btn-dashed').length).toEqual(0)
    })
  })

  describe('can delete', () => {
    it('without required', () => {
      const { container } = render(<Form>
        <FormItem
          id='test'
          type='string[]'
        />
      </Form>)

      userEvent.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(container.getElementsByClassName('anticon-minus-circle').length).toEqual(1)
      expect(container.getElementsByClassName('ant-input').length).toEqual(1)

      userEvent.click(container.getElementsByClassName('anticon-minus-circle')[0])

      expect(container.getElementsByClassName('anticon-minus-circle').length).toEqual(0)
      expect(container.getElementsByClassName('ant-input').length).toEqual(0)
    })

    it('with required', () => {
      const { container } = render(<Form>
        <FormItem
          id='test'
          type='string[]'
          required
        />
      </Form>)

      userEvent.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(container.getElementsByClassName('anticon-minus-circle').length).toEqual(0)
      expect(container.getElementsByClassName('ant-input').length).toEqual(1)

      userEvent.click(container.getElementsByClassName('ant-btn-dashed')[0])

      expect(container.getElementsByClassName('anticon-minus-circle').length).toEqual(1)
      expect(container.getElementsByClassName('ant-input').length).toEqual(2)

      userEvent.click(container.getElementsByClassName('anticon-minus-circle')[0])

      expect(container.getElementsByClassName('anticon-minus-circle').length).toEqual(0)
      expect(container.getElementsByClassName('ant-input').length).toEqual(1)
    })
  })
})
