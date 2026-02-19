import { setMock } from '@faasjs/browser'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App, useApp } from '../../App'
import { useFaas } from '../../FaasDataWrapper'

describe('App', () => {
  it('should render children', () => {
    render(
      <App>
        <div>Test</div>
      </App>,
    )

    expect(screen.getByText('Test')).toBeDefined()
  })

  it('should provide message', async () => {
    let renderUseEffectCount = 0
    let renderComponentCount = 0

    function Component() {
      const { message } = useApp()

      useEffect(() => {
        message.info('Hello')
        renderUseEffectCount++
      }, [message])

      renderComponentCount++

      return (
        <button type='button' onClick={() => message.info('Hi')}>
          Component
        </button>
      )
    }

    const user = userEvent.setup()

    render(
      <App>
        <Component />
      </App>,
    )

    expect(screen.getByText('Hello')).toBeDefined()
    expect(renderUseEffectCount).toBe(1)
    expect(renderComponentCount).toBe(1)

    await user.click(screen.getByRole('button'))

    expect(screen.getByText('Hi')).toBeDefined()
    expect(renderUseEffectCount).toBe(1)
    expect(renderComponentCount).toBe(1)
  })

  it('should provide notification', async () => {
    let renderUseEffectCount = 0
    let renderComponentCount = 0

    function Component() {
      const { notification } = useApp()

      useEffect(() => {
        notification.info({
          title: 'Hello',
        })
        renderUseEffectCount++
      }, [notification])

      renderComponentCount++

      return (
        <button type='button' onClick={() => notification.info({ title: 'Hi' })}>
          Component
        </button>
      )
    }

    const user = userEvent.setup()

    render(
      <App>
        <Component />
      </App>,
    )

    expect(screen.getByText('Hello')).toBeDefined()
    expect(renderUseEffectCount).toBe(1)
    expect(renderComponentCount).toBe(1)

    await user.click(screen.getByText('Component'))

    expect(screen.getByText('Hi')).toBeDefined()
    expect(renderUseEffectCount).toBe(1)
    expect(renderComponentCount).toBe(1)
  })

  it('should provide modal', async () => {
    const user = userEvent.setup()
    let renderComponentCount = 0

    function Component() {
      const { setModalProps } = useApp()

      renderComponentCount++

      return (
        <button
          type='button'
          onClick={() =>
            setModalProps({
              open: true,
              title: 'Hi Modal',
            })
          }
        >
          Component
        </button>
      )
    }

    render(
      <App>
        <Component />
      </App>,
    )

    expect(screen.queryByText('Hi Modal')).toBeNull()
    expect(renderComponentCount).toBe(1)

    await user.click(screen.getByRole('button'))

    expect(screen.getByText('Hi Modal')).toBeDefined()
    expect(renderComponentCount).toBe(1)
  })

  it('should provide drawer', async () => {
    const user = userEvent.setup()
    let renderComponentCount = 0

    function Component() {
      const { setDrawerProps } = useApp()

      renderComponentCount++

      return (
        <button
          type='button'
          onClick={() =>
            setDrawerProps({
              open: true,
              title: 'Hi Drawer',
            })
          }
        >
          Component
        </button>
      )
    }

    render(
      <App>
        <Component />
      </App>,
    )

    expect(screen.queryByText('Hi Drawer')).toBeNull()
    expect(renderComponentCount).toBe(1)

    await user.click(screen.getByRole('button'))

    expect(screen.getByText('Hi Drawer')).toBeDefined()
    expect(renderComponentCount).toBe(1)
  })

  it('should work without BrowserRouter', () => {
    function Nav() {
      const navigate = useNavigate()

      return (
        <button type='button' onClick={() => navigate('/')}>
          Nav
        </button>
      )
    }

    render(
      <App browserRouterProps={false}>
        <Nav />
      </App>,
    )

    expect(screen.getByText(/useNavigate\(\) may be used only in the context/)).toBeDefined()

    render(
      <App browserRouterProps={false}>
        <div>OK</div>
      </App>,
    )

    expect(screen.getByText('OK')).toBeDefined()
  })

  it('error notification should work', async () => {
    setMock(async () => Error('error message'))

    function Component() {
      const { loading } = useFaas('test', { key: 'value' })

      if (loading) return null

      return <div>test</div>
    }

    render(
      <App faasConfigProviderProps={{ faasClientOptions: {} }}>
        <Component />
      </App>,
    )

    expect(await screen.findAllByText('error message')).toHaveLength(2)
  })
})
