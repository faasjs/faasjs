import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Title } from '../../Title'

describe('Title', () => {
  it('should change title', () => {
    render(<Title title='title' />)

    expect(document.title).toEqual('title')

    render(<Title title={['a', 'b']} separator='|' suffix='suffix' />)

    expect(document.title).toEqual('a|b|suffix')
  })

  describe('should return h1', () => {
    it('when title is a text', () => {
      const { container } = render(<Title title='title' h1 />)

      expect(document.title).toEqual('title')
      expect(container.innerHTML).toEqual('<h1>title</h1>')
    })

    it('when title is an array', () => {
      const { container } = render(<Title title={['a', 'b']} h1 />)

      expect(document.title).toEqual('a - b')
      expect(container.innerHTML).toEqual('<h1>a</h1>')
    })

    it('when h1 is an object and title is a text', () => {
      const { container } = render(
        <Title title='title' h1={{ className: 'custom-title', style: { color: 'red' } }} />,
      )

      expect(document.title).toEqual('title')
      expect(container.innerHTML).toContain('class="custom-title"')
      expect(container.innerHTML).toContain('title')
    })

    it('when h1 is an object and title is an array', () => {
      const { container } = render(<Title title={['first', 'second']} h1={{ className: 'custom' }} />)

      expect(document.title).toEqual('first - second')
      expect(container.innerHTML).toEqual('<h1 class="custom">first</h1>')
    })
  })

  describe('should return plain', () => {
    it('when title is a text', () => {
      const { container } = render(<Title title='title' plain />)

      expect(document.title).toEqual('title')
      expect(container.innerHTML).toEqual('title')
    })

    it('when title is an array', () => {
      const { container } = render(<Title title={['a', 'b']} plain />)

      expect(document.title).toEqual('a - b')
      expect(container.innerHTML).toEqual('a')
    })
  })

  describe('it should return children', () => {
    it('static children', () => {
      const { container } = render(
        <Title title='title'>
          <h2>h2</h2>
        </Title>,
      )

      expect(document.title).toEqual('title')
      expect(container.innerHTML).toEqual('<h2 title="title">h2</h2>')
    })

    it('children with props', () => {
      function CustomTitle(props: { title?: string; className: string }) {
        return <h2 className={props.className}>{props.title}</h2>
      }

      const { container } = render(
        <Title title='title'>
          <CustomTitle className='class' />
        </Title>,
      )

      expect(document.title).toEqual('title')
      expect(container.innerHTML).toEqual('<h2 class="class">title</h2>')
    })
  })
})
