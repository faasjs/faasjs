/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link } from '../../Link'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from '../../Config'

describe('Link', () => {
  it('should work', async () => {
    render(
      <BrowserRouter>
        <Link href='/test' text='text' />
      </BrowserRouter>
    )

    expect(screen.getByText('text')).toBeInTheDocument()

    await userEvent.click(screen.getByText('text'))

    expect(window.location.pathname).toBe('/test')
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
      <ConfigProvider theme={{ Link: { style: { fontWeight: 'bold' } } }}>
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

  it('work with special target', async () => {
    const { container } = render(
      <BrowserRouter>
        <Link href='/' text='text' target='_blank' />
      </BrowserRouter>
    )

    expect(container.querySelector('[target="_blank"]')).toBeInTheDocument()
  })

  it('work with global target', async () => {
    const { container } = render(
      <ConfigProvider theme={{ Link: { target: '_blank' } }}>
        <BrowserRouter>
          <Link href='/' text='text' />
        </BrowserRouter>
      </ConfigProvider>
    )

    expect(container.querySelector('[target="_blank"]')).toBeInTheDocument()
  })

  it('work with button', async () => {
    const { container } = render(
      <BrowserRouter>
        <Link href='/' text='text' button />
      </BrowserRouter>
    )

    expect(container.querySelector('button.ant-btn')).toBeInTheDocument()
  })

  it('work with onClick', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <BrowserRouter>
        <Link href='/' text='text' onClick={() => alert('ok')} />
      </BrowserRouter>
    )

    await userEvent.click(screen.getByText('text'))

    expect(alertMock).toHaveBeenCalledWith('ok')

    alertMock.mockRestore()
  })
})
