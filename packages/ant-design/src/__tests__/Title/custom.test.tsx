/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { CustomTitle } from '../../Title'

describe('CustomTitle', () => {
  it('should change title', () => {
    render(<CustomTitle title="title" />)

    expect(document.title).toEqual('title')

    render(<CustomTitle
      title={ 'a' }
    />)

    expect(document.title).toEqual('a')
  })

  describe('should return h1', () => {
    it('when title is a text', () => {
      const { container } = render(<CustomTitle
        title='title'
        level={ 1 }
        type='success'
      />)

      expect(document.title).toEqual('title')
      expect(container.innerHTML).toEqual('<h1 class="ant-typography ant-typography-success">title</h1>')
    })
  })
})
