import { act, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useDrawer } from '../../Drawer'
import { useModal } from '../../Modal'

describe('dialog hooks', () => {
  it('should toggle drawer open state through setDrawerProps', () => {
    let result: ReturnType<typeof useDrawer>

    function App() {
      result = useDrawer({ title: 'title', open: true })

      return null
    }

    render(<App />)

    expect(result!.drawerProps.open).toBe(true)

    act(() => result!.setDrawerProps({ open: false }))

    expect(result!.drawerProps.open).toBe(false)
  })

  it('should toggle modal open state through setModalProps', () => {
    let result: ReturnType<typeof useModal>

    function App() {
      result = useModal({ title: 'title', open: true })

      return null
    }

    render(<App />)

    expect(result!.modalProps.open).toBe(true)

    act(() => result!.setModalProps({ open: false }))

    expect(result!.modalProps.open).toBe(false)
  })
})
