import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useNavigate } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let capturedFaasClientOptions: any
let lastMessageApi: any

vi.mock('antd', async () => {
  const React = await import('react')

  return {
    Alert(props: any) {
      return React.createElement(
        'div',
        { 'data-testid': 'alert' },
        props.message,
        props.description,
      )
    },
    ConfigProvider(props: any) {
      return React.createElement('div', { 'data-testid': 'antd-config' }, props.children)
    },
    Drawer(props: any) {
      return props.open ? React.createElement('div', null, props.title) : null
    },
    Modal(props: any) {
      return props.open ? React.createElement('div', null, props.title) : null
    },
    message: {
      useMessage() {
        lastMessageApi = {
          error: vi.fn(),
          info: vi.fn(),
        }

        return [lastMessageApi, React.createElement('div', { key: 'message-holder' })]
      },
    },
    notification: {
      useNotification() {
        return [
          {
            info: vi.fn(),
          },
          React.createElement('div', { key: 'notification-holder' }),
        ]
      },
    },
  }
})

vi.mock('../../Config', async () => {
  const React = await import('react')

  return {
    ConfigProvider(props: any) {
      capturedFaasClientOptions = props.faasClientOptions

      return React.createElement(React.Fragment, null, props.children)
    },
  }
})

import { App } from '../../App'
import { useApp } from '../../useApp'

describe('App/coverage', () => {
  beforeEach(() => {
    capturedFaasClientOptions = undefined
    lastMessageApi = undefined
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should close open drawers and modals after navigation', async () => {
    const user = userEvent.setup()

    function Component() {
      const navigate = useNavigate()
      const { setDrawerProps, setModalProps } = useApp()

      return (
        <>
          <button
            type="button"
            onClick={() => {
              setDrawerProps({
                open: true,
                title: 'Route Drawer',
              })
              setModalProps({
                open: true,
                title: 'Route Modal',
              })
            }}
          >
            Open
          </button>
          <button type="button" onClick={() => navigate('/next')}>
            Navigate
          </button>
        </>
      )
    }

    render(
      <App>
        <Component />
      </App>,
    )

    await user.click(screen.getByText('Open'))

    expect(screen.getByText('Route Drawer')).toBeDefined()
    expect(screen.getByText('Route Modal')).toBeDefined()

    await user.click(screen.getByText('Navigate'))

    await waitFor(() => {
      expect(screen.queryByText('Route Drawer')).toBeNull()
      expect(screen.queryByText('Route Modal')).toBeNull()
    })
  })

  it('should ignore abort errors and surface unknown errors', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <App
        faasConfigProviderProps={{ faasClientOptions: { options: { headers: { test: 'ok' } } } }}
      >
        <div>Ready</div>
      </App>,
    )

    expect(screen.getByText('Ready')).toBeDefined()
    expect(capturedFaasClientOptions.options.headers).toEqual({ test: 'ok' })

    await capturedFaasClientOptions.onError('load/test')(new Error('AbortError'))
    expect(lastMessageApi.error).not.toHaveBeenCalled()

    await capturedFaasClientOptions.onError('load/test')({
      toString: () => 'plain object failure',
    })
    expect(lastMessageApi.error).toHaveBeenCalledWith('Unknown error')

    await capturedFaasClientOptions.onError('load/test')(new Error('known failure'))
    expect(lastMessageApi.error).toHaveBeenCalledWith('known failure')
    expect(consoleError).toHaveBeenCalled()
  })
})
