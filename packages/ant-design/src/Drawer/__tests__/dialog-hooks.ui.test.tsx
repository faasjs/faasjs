import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

let lastDrawerProps: any
let lastModalProps: any

vi.mock('antd', async () => {
  const React = await import('react')

  return {
    Drawer(props: any) {
      lastDrawerProps = props

      return React.createElement(
        'button',
        {
          'data-testid': 'drawer-close',
          onClick: () => props.onClose?.(),
        },
        props.title,
      )
    },
    Modal(props: any) {
      lastModalProps = props

      return React.createElement(
        'button',
        {
          'data-testid': 'modal-close',
          onClick: () => props.onCancel?.(),
        },
        props.title,
      )
    },
  }
})

import { useDrawer } from '../../Drawer'
import { useModal } from '../../Modal'

describe('dialog hooks coverage', () => {
  beforeEach(() => {
    lastDrawerProps = undefined
    lastModalProps = undefined
  })

  it('should close the drawer through the generated onClose handler', async () => {
    function App() {
      const drawer = useDrawer({
        title: 'title',
        open: true,
      })

      return (
        <>
          {drawer.drawer}
          <span data-testid="drawer-open">{String(drawer.drawerProps.open)}</span>
        </>
      )
    }

    render(<App />)

    expect(screen.getByTestId('drawer-open').textContent).toBe('true')

    fireEvent.click(screen.getByTestId('drawer-close'))

    await waitFor(() => {
      expect(screen.getByTestId('drawer-open').textContent).toBe('false')
    })

    expect(lastDrawerProps.open).toBe(false)
  })

  it('should close the modal through the generated onCancel handler', async () => {
    function App() {
      const modal = useModal({
        title: 'title',
        open: true,
      })

      return (
        <>
          {modal.modal}
          <span data-testid="modal-open">{String(modal.modalProps.open)}</span>
        </>
      )
    }

    render(<App />)

    expect(screen.getByTestId('modal-open').textContent).toBe('true')

    fireEvent.click(screen.getByTestId('modal-close'))

    await waitFor(() => {
      expect(screen.getByTestId('modal-open').textContent).toBe('false')
    })

    expect(lastModalProps.open).toBe(false)
  })
})
