/**
 * @jest-environment @happy-dom/jest-environment
 */

import { render, screen } from '@testing-library/react'
import { type ModalProps, useModal } from '../../Modal'

describe('Modal', () => {
  it('should work', async () => {
    let setModalProps: (changes: Partial<ModalProps>) => void

    function App() {
      const Modal = useModal({
        title: 'title',
        open: true,
      })

      if (!setModalProps) setModalProps = Modal.setModalProps

      return Modal.modal
    }

    render(<App />)

    expect(screen.getByText('title')).toBeDefined()

    setModalProps({ title: 'new title' })

    expect(await screen.findByText('new title')).toBeDefined()
  })

  it('should work with handler', async () => {
    let setModalProps: (
      changes: (prev: Partial<ModalProps>) => Partial<ModalProps>
    ) => void

    function App() {
      const Modal = useModal({
        title: 'title',
        open: true,
      })

      if (!setModalProps) setModalProps = Modal.setModalProps

      return Modal.modal
    }

    render(<App />)

    expect(screen.getByText('title')).toBeDefined()

    setModalProps(() => ({ title: 'new title' }))

    expect(await screen.findByText('new title')).toBeDefined()
  })
})
