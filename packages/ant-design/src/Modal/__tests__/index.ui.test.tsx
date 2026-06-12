import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { type ModalProps, useModal } from '../../Modal'

describe('Modal', () => {
  it('should work', async () => {
    let setModalProps: ((changes: Partial<ModalProps>) => void) | undefined

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

    if (!setModalProps) throw Error('setModalProps not initialized')
    setModalProps({ title: 'new title' })

    expect(await screen.findByText('new title')).toBeDefined()
  })

  it('should work with handler', async () => {
    let setModalProps:
      | ((changes: (prev: Partial<ModalProps>) => Partial<ModalProps>) => void)
      | undefined

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

    if (!setModalProps) throw Error('setModalProps not initialized')
    const updateModalProps = setModalProps
    act(() => updateModalProps((prev) => ({ ...prev, title: 'new title' })))

    expect(await screen.findByText('new title')).toBeDefined()

    let previousTitle: ModalProps['title']
    act(() =>
      updateModalProps((prev) => {
        previousTitle = prev.title

        return { ...prev, title: 'new title again' }
      }),
    )

    expect(previousTitle).toBe('new title')
    expect(await screen.findByText('new title again')).toBeDefined()
  })

  it('should reset props when open is false and preserve props otherwise', async () => {
    let result: ReturnType<typeof useModal>

    function App() {
      result = useModal()

      return result.modal
    }

    render(<App />)

    act(() =>
      result!.setModalProps({
        open: true,
        title: 'title',
        children: 'content',
      }),
    )

    expect(await screen.findByText('title')).toBeDefined()
    expect(screen.getByText('content')).toBeDefined()

    act(() =>
      result!.setModalProps({
        open: true,
        confirmLoading: true,
      }),
    )

    expect(result!.modalProps).toMatchObject({
      open: true,
      title: 'title',
      children: 'content',
      confirmLoading: true,
    })

    act(() => result!.setModalProps((prev) => ({ ...prev, open: false })))

    expect(result!.modalProps).toMatchObject({
      open: false,
    })
    expect(result!.modalProps.title).toBeUndefined()
    expect(result!.modalProps.children).toBeUndefined()
    expect(result!.modalProps.confirmLoading).toBeUndefined()

    act(() =>
      result!.setModalProps({
        open: true,
        title: 'new title',
      }),
    )

    expect(await screen.findByText('new title')).toBeDefined()
    expect(result!.modalProps).toMatchObject({
      open: true,
      title: 'new title',
    })
    expect(result!.modalProps.children).toBeUndefined()
    expect(result!.modalProps.confirmLoading).toBeUndefined()
  })
})
