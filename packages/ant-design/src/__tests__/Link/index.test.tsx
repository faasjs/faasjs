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

  it('work with external link', async () => {
    const origin = window.open
    window.open = jest.fn()

    const { container } = render(
      <BrowserRouter>
        <Link href='http://test.com' text='text' />
      </BrowserRouter>
    )

    expect(container.querySelector('[target="_blank"]')).toBeInTheDocument()

    await userEvent.click(screen.getByText('text'))

    expect(window.location.hostname).toBe('localhost')
    expect(window.open).toHaveBeenCalledWith('http://test.com')

    window.open = origin
  })

  it('work with external link and children', async () => {
    const origin = window.open
    window.open = jest.fn()

    render(
      <BrowserRouter>
        <Link href='http://testtest.com'>
          <div>Child</div>
        </Link>
      </BrowserRouter>
    )

    await userEvent.click(screen.getByText('Child'))

    expect(window.location.hostname).toBe('localhost')
    expect(window.open).toHaveBeenCalledWith('http://testtest.com')

    window.open = origin
  })

  describe('work with button', () => {
    it('should work', async () => {
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
          <Link href='/' text='text' onClick={() => alert('ok')} button />
        </BrowserRouter>
      )

      await userEvent.click(screen.getByText('text'))

      expect(alertMock).toHaveBeenCalledWith('ok')

      alertMock.mockRestore()
    })

    it('work with external link', async () => {
      const origin = window.open
      window.open = jest.fn()

      render(
        <BrowserRouter>
          <Link href='http://test.com' text='text' button />
        </BrowserRouter>
      )

      await userEvent.click(screen.getByText('text'))

      expect(window.location.hostname).toBe('localhost')
      expect(window.open).toHaveBeenCalledWith('http://test.com')

      window.open = origin
    })
  })
})
