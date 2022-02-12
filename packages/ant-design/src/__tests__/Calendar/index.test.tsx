/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { Calendar } from '../../Calendar'
import dayjs from 'dayjs'

describe('Calandar', () => {
  it('should work', () => {
    const { container } = render(
      <Calendar
        defaultValue={ dayjs('2000-01-01 00:00:00') }
      />
    )

    expect(container.getElementsByClassName('ant-picker-calendar').length).toEqual(1)
  })
})
