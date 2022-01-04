/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormItem } from '../../FormItem'

describe('FormItem string', () => {
  it('with options', async () => {
    const { container } = render(<FormItem
      id='test'
      type='string'
      options={[
        {
          label: 'label',
          value: 'value'
        }
      ]}
    />)

    expect(container.getElementsByClassName('ant-select-selector').length).toEqual(1)

    userEvent.click(container.getElementsByClassName('ant-select-selector')[0])

    expect(await screen.findByText('label')).toBeInTheDocument()
  })
})
