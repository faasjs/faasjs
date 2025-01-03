import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormItem } from '../../FormItem'

describe('FormItem time', () => {
  it('with options', async () => {
    const { container } = render(<FormItem id='test' type='time' />)

    expect(container.getElementsByClassName('ant-picker').length).toEqual(1)
  })
})
