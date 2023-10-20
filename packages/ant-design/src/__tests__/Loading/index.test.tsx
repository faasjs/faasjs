/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { Loading } from '../../Loading'

describe('Loading', () => {
  it('should work', () => {
    const { container } = render(<Loading />)

    expect(container.innerHTML).toContain('ant-spin-dot')
  })

  it('should work with children', () => {
    render(<Loading loading={false}>children</Loading>)

    expect(screen.getByText('children')).toBeInTheDocument()
  })
})
