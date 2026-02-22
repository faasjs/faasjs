import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Loading } from '../../Loading'

describe('Loading', () => {
  it('should work', () => {
    const { container } = render(<Loading />)

    expect(container.innerHTML).toContain('ant-spin-dot')
  })

  it('should work with children', () => {
    render(<Loading loading={false}>children</Loading>)

    expect(screen.getByText('children')).toBeDefined()
  })

  it('should keep large layout when size is explicitly large', () => {
    const { container } = render(<Loading size='large' />)

    const wrapper = container.firstElementChild as HTMLDivElement
    expect(wrapper.style.margin).toBe('20vh auto')
    expect(wrapper.style.textAlign).toBe('center')
  })

  it('should skip large layout when size is small', () => {
    const { container } = render(<Loading size='small' />)

    const wrapper = container.firstElementChild as HTMLDivElement
    expect(wrapper.style.margin).toBe('')
    expect(wrapper.style.textAlign).toBe('')
  })
})
