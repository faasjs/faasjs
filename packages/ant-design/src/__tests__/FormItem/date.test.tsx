/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { FormItem } from '../../FormItem'

describe('FormItem date', () => {
  it('with options', async () => {
    const { container } = render(<FormItem id='test' type='date' />)

    expect(container.getElementsByClassName('ant-picker').length).toEqual(1)
  })
})
