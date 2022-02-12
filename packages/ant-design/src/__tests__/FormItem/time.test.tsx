/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormItem } from '../../FormItem'

describe('FormItem time', () => {
  it('with options', async () => {
    const { container } = render(
      <FormItem
        id="test"
        type="time"
      />
    )

    expect(container.getElementsByClassName('ant-picker').length).toEqual(1)
  })
})
