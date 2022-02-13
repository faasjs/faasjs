/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import dayjs from 'dayjs'
import { DatePicker } from '../../DatePicker'

describe('DatePicker', () => {
  it('should work', () => {
    const { container } = render(
      <DatePicker
        defaultValue={ dayjs('2000-01-01 00:00:00') }
      />
    )

    expect(container.getElementsByClassName('ant-picker').length).toEqual(1)
  })
})
