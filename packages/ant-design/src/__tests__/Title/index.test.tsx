/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { Title } from '../../Title'

describe('Title', () => {
  it('should change title', () => {
    render(<Title title="title" />)
    expect(document.title).toEqual('title')
    render(<Title
      title={ ['a', 'b'] }
      separator='|'
      suffix='suffix'
    />)
    expect(document.title).toEqual('a|b|suffix')
  })
  describe('should return h1', () => {
    it('when title is a text', () => {
      const { container } = render(<Title
        title='title'
        level={ 1 }
        render={ true }
      />)
      expect(document.title).toEqual('title')
      expect(container.innerHTML).toEqual('<h1 class="ant-typography">title</h1>')
    })
    it('when title is an array', () => {
      const { container } = render(<Title
        title={ ['a', 'b'] }
        level={ 1 }
        render={ true }
      />)
      expect(document.title).toEqual('a - b')
      expect(container.innerHTML).toEqual('<h1 class="ant-typography">a</h1>')
    })
  })
})
