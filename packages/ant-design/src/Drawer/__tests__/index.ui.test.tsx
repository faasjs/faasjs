import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { type DrawerProps, useDrawer } from '../../Drawer'

describe('Drawer', () => {
  it('should work', async () => {
    let setDrawerProps: ((changes: Partial<DrawerProps>) => void) | undefined

    function App() {
      const drawer = useDrawer({
        title: 'title',
        open: true,
      })

      if (!setDrawerProps) setDrawerProps = drawer.setDrawerProps

      return drawer.drawer
    }

    render(<App />)

    expect(screen.getByText('title')).toBeDefined()

    if (!setDrawerProps) throw Error('setDrawerProps not initialized')
    setDrawerProps({ title: 'new title' })

    expect(await screen.findByText('new title')).toBeDefined()
  })

  it('should work with handler', async () => {
    let setDrawerProps:
      | ((changes: (prev: Partial<DrawerProps>) => Partial<DrawerProps>) => void)
      | undefined

    function App() {
      const drawer = useDrawer({
        title: 'title',
        open: true,
      })

      if (!setDrawerProps) setDrawerProps = drawer.setDrawerProps

      return drawer.drawer
    }

    render(<App />)

    expect(screen.getByText('title')).toBeDefined()

    if (!setDrawerProps) throw Error('setDrawerProps not initialized')
    const updateDrawerProps = setDrawerProps
    act(() => updateDrawerProps((prev) => ({ ...prev, title: 'new title' })))

    expect(await screen.findByText('new title')).toBeDefined()

    let previousTitle: DrawerProps['title']
    act(() =>
      updateDrawerProps((prev) => {
        previousTitle = prev.title

        return { ...prev, title: 'new title again' }
      }),
    )

    expect(previousTitle).toBe('new title')
    expect(await screen.findByText('new title again')).toBeDefined()
  })

  it('should reset props when open is false and preserve props otherwise', async () => {
    let result: ReturnType<typeof useDrawer>

    function App() {
      result = useDrawer()

      return result.drawer
    }

    render(<App />)

    act(() =>
      result!.setDrawerProps({
        open: true,
        title: 'title',
        children: <div>content</div>,
      }),
    )

    expect(await screen.findByText('title')).toBeDefined()
    expect(screen.getByText('content')).toBeDefined()

    act(() =>
      result!.setDrawerProps({
        open: true,
        className: 'custom-drawer',
      }),
    )

    expect(result!.drawerProps).toMatchObject({
      open: true,
      title: 'title',
      className: 'custom-drawer',
    })
    expect(result!.drawerProps.children).toBeDefined()

    act(() => result!.setDrawerProps((prev) => ({ ...prev, open: false })))

    expect(result!.drawerProps).toMatchObject({
      open: false,
    })
    expect(result!.drawerProps.title).toBeUndefined()
    expect(result!.drawerProps.children).toBeUndefined()
    expect(result!.drawerProps.className).toBeUndefined()

    act(() =>
      result!.setDrawerProps({
        open: true,
        title: 'new title',
      }),
    )

    expect(await screen.findByText('new title')).toBeDefined()
    expect(result!.drawerProps).toMatchObject({
      open: true,
      title: 'new title',
    })
    expect(result!.drawerProps.children).toBeUndefined()
    expect(result!.drawerProps.className).toBeUndefined()
  })
})
