import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useNavigate } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { App, createOnErrorHandler } from '../../App'
import { useApp } from '../../useApp'

describe('App/coverage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should close open drawers and modals after navigation', async () => {
    const user = userEvent.setup()

    function TestComponent() {
      const navigate = useNavigate()
      const { drawerProps, modalProps, setDrawerProps, setModalProps } = useApp()

      return (
        <>
          <button
            type="button"
            onClick={() => {
              setDrawerProps({ open: true, title: 'Route Drawer' })
              setModalProps({ open: true, title: 'Route Modal' })
            }}
          >
            Open
          </button>
          <button type="button" onClick={() => navigate('/next')}>
            Navigate
          </button>
          <span data-testid="drawer-open">{String(drawerProps.open)}</span>
          <span data-testid="modal-open">{String(modalProps.open)}</span>
        </>
      )
    }

    render(
      <App>
        <TestComponent />
      </App>,
    )

    expect(screen.getByTestId('drawer-open').textContent).toBe('false')
    expect(screen.getByTestId('modal-open').textContent).toBe('false')

    await user.click(screen.getByText('Open'))

    expect(screen.getByTestId('drawer-open').textContent).toBe('true')
    expect(screen.getByTestId('modal-open').textContent).toBe('true')

    await user.click(screen.getByText('Navigate'))

    await waitFor(() => {
      expect(screen.getByTestId('drawer-open').textContent).toBe('false')
      expect(screen.getByTestId('modal-open').textContent).toBe('false')
    })
  })

  describe('createOnErrorHandler', () => {
    it('should ignore abort errors and surface unknown errors', async () => {
      const messageApi = { error: vi.fn<() => void>() }
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const onError = createOnErrorHandler(messageApi)

      await onError('load/test')(new Error('AbortError'))

      expect(messageApi.error).not.toHaveBeenCalled()

      await onError('load/test')({
        toString: () => 'plain object failure',
      })

      expect(messageApi.error).toHaveBeenCalledWith('Unknown error')

      await onError('load/test')(new Error('known failure'))

      expect(messageApi.error).toHaveBeenCalledWith('known failure')
      expect(consoleError).toHaveBeenCalled()
    })
  })
})
