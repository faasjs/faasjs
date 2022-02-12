/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { TimePicker } from '../../TimePicker'
import dayjs from 'dayjs'

describe('TimePicker', () => {
  it('should work', () => {
    const { container } = render(
      <TimePicker
        defaultValue={ dayjs('2000-01-01 00:00:00') }
      />
    )

    expect(container.getElementsByClassName('ant-picker').length).toEqual(1)
  })
})
