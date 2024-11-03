/**
 * @jest-environment @happy-dom/jest-environment
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from '../../Config'
import { Link } from '../../Link'

describe('Link', () => {
  it('should work', async () => {
    render(
      <BrowserRouter>
        <Link href='/test' text='text' />
      </BrowserRouter>
    )

    expect(screen.getByText('text')).toBeDefined()

    await userEvent.click(screen.getByText('text'))

    expect(window.location.pathname).toBe('/test')
  })

  it('work with block', async () => {
    const { container } = render(
      <BrowserRouter>
        <Link href='/' text='text' block />
      </BrowserRouter>
    )

    expect(container.querySelector('a').style.display).toEqual('block')
    expect(container.querySelector('a').style.width).toEqual('100%')
  })

  it('work with global style', async () => {
    const { container } = render(
      <ConfigProvider theme={{ Link: { style: { fontWeight: 'bold' } } }}>
        <BrowserRouter>
          <Link href='/' text='text' />
        </BrowserRouter>
      </ConfigProvider>
    )

    expect(container.querySelector('a').style.fontWeight).toEqual('bold')
  })

  it('work with copyable', async () => {
    const { container } = render(
      <BrowserRouter>
        <Link href='/' text='text' copyable />
      </BrowserRouter>
    )

    expect(container.querySelector('.ant-typography-copy')).toBeDefined()
  })

  it('work with special target', async () => {
    const { container } = render(
      <BrowserRouter>
        <Link href='/' text='text' target='_blank' />
      </BrowserRouter>
    )

    expect(container.querySelector('[target="_blank"]')).toBeDefined()
  })

  it('work with global target', async () => {
    const { container } = render(
      <ConfigProvider theme={{ Link: { target: '_blank' } }}>
        <BrowserRouter>
          <Link href='/' text='text' />
        </BrowserRouter>
      </ConfigProvider>
    )

    expect(container.querySelector('[target="_blank"]')).toBeDefined()
  })

  it('work with onClick', async () => {
    let called = false

    render(
      <BrowserRouter>
        <Link href='/' text='text' onClick={() => (called = true)} />
      </BrowserRouter>
    )

    await userEvent.click(screen.getByText('text'))

    expect(called).toBeTruthy()
  })

  it('work with external link', async () => {
    const origin = window.open
    window.open = jest.fn()

    const { container } = render(
      <BrowserRouter>
        <Link href='http://test.com' text='text' />
      </BrowserRouter>
    )

    expect(container.querySelector('[target="_blank"]')).toBeDefined()

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

      expect(container.querySelector('button.ant-btn')).toBeDefined()
    })

    it('work with onClick', async () => {
      let called = false

      render(
        <BrowserRouter>
          <Link href='/' text='text' onClick={() => (called = true)} button />
        </BrowserRouter>
      )

      await userEvent.click(screen.getByText('text'))

      expect(called).toBeTruthy()
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
