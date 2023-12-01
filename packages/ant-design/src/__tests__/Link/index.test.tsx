/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { Link } from '../../Link'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from '../../Config'

describe('Link', () => {
  it('should work', async () => {
    render(
      <BrowserRouter>
        <Link href='/' text='text' />
      </BrowserRouter>
    )

    expect(screen.getByText('text')).toBeInTheDocument()
  })

  it('work with block', async () => {
    const { container } = render(
      <BrowserRouter>
        <Link href='/' text='text' block />
      </BrowserRouter>
    )

    expect(container.querySelector('a')).toHaveStyle(
      'display: block;width: 100%;'
    )
  })

  it('work with global style', async () => {
    const { container } = render(
      <ConfigProvider config={{ Link: { style: { fontWeight: 'bold' } } }}>
        <BrowserRouter>
          <Link href='/' text='text' />
        </BrowserRouter>
      </ConfigProvider>
    )

    expect(container.querySelector('a')).toHaveStyle('font-weight: bold')
  })

  it('work with copyable', async () => {
    const { container } = render(
      <BrowserRouter>
        <Link href='/' text='text' copyable />
      </BrowserRouter>
    )

    expect(container.querySelector('.ant-typography-copy')).toBeInTheDocument()
  })
})
