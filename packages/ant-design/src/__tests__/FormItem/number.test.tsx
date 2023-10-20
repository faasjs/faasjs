/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormItem } from '../../FormItem'

describe('FormItem number', () => {
  it('with options', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <FormItem
        id='test'
        type='number'
        options={[
          {
            label: 'label',
            value: 'value',
          },
        ]}
      />
    )

    expect(container.getElementsByClassName('ant-radio-input').length).toEqual(
      1
    )

    await user.click(container.getElementsByClassName('ant-radio-input')[0])

    expect(await screen.findByText('label')).toBeInTheDocument()
  })
})
