/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { Title } from '../../Title'

describe('Title', () => {
  it('should work', () => {
    render(<Title title="title" />)

    expect(document.title).toEqual('title')

    render(<Title
      title={ ['a', 'b'] }
      separator='|'
      suffix='suffix'
    />)

    expect(document.title).toEqual('a|b|suffix')
  })
})
