/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { type DrawerProps, useDrawer } from '../../Drawer'

describe('Drawer', () => {
  it('should work', async () => {
    let setDrawerProps: (changes: Partial<DrawerProps>) => void

    function App() {
      const drawer = useDrawer({
        title: 'title',
        open: true,
      })

      if (!setDrawerProps) setDrawerProps = drawer.setDrawerProps

      return drawer.drawer
    }

    render(<App />)

    expect(screen.getByText('title')).toBeInTheDocument()

    setDrawerProps({ title: 'new title' })

    expect(await screen.findByText('new title')).toBeInTheDocument()
  })

  it('should work with handler', async () => {
    let setDrawerProps: (
      changes: (prev: Partial<DrawerProps>) => Partial<DrawerProps>
    ) => void

    function App() {
      const drawer = useDrawer({
        title: 'title',
        open: true,
      })

      if (!setDrawerProps) setDrawerProps = drawer.setDrawerProps

      return drawer.drawer
    }

    render(<App />)

    expect(screen.getByText('title')).toBeInTheDocument()

    setDrawerProps(() => ({ title: 'new title' }))

    expect(await screen.findByText('new title')).toBeInTheDocument()
  })
})
