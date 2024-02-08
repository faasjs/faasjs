/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { ModalProps, useModal } from '../../Modal'

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

    expect(screen.getByText('title')).toBeInTheDocument()

    setModalProps({ title: 'new title' })

    expect(await screen.findByText('new title')).toBeInTheDocument()
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

    expect(screen.getByText('title')).toBeInTheDocument()

    setModalProps(() => ({ title: 'new title' }))

    expect(await screen.findByText('new title')).toBeInTheDocument()
  })
})
