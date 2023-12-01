/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { DrawerProps, useDrawer } from '../../Drawer'

describe('Drawer', () => {
  let setDrawerProps: (changes: Partial<DrawerProps>) => void

  function App() {
    const drawer = useDrawer({
      title: 'title',
      open: true,
    })

    if (!setDrawerProps) setDrawerProps = drawer.setDrawerProps

    return drawer.drawer
  }

  it('should work', async () => {
    render(<App />)

    expect(screen.getByText('title')).toBeInTheDocument()

    setDrawerProps({ title: 'new title' })

    expect(await screen.findByText('new title')).toBeInTheDocument()
  })
})
