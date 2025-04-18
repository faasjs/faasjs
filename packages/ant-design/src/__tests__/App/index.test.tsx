import { setMock } from '@faasjs/browser'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App, useApp } from '../../App'
import { useFaas } from '../../FaasDataWrapper'

describe('App', () => {
  it('should work', async () => {
    let ContainerTimes = 0
    let ButtonTimes = 0
    let ComponentTimes = 0

    function Container() {
      ContainerTimes++

      return (
        <>
          <Component />
          <Button />
        </>
      )
    }

    Container.whyDidYouRender = true

    function Button() {
      const { setModalProps, setDrawerProps } = useApp()

      ButtonTimes++

      return (
        <button
          type='button'
          onClick={() => {
            setDrawerProps({
              open: true,
              title: 'Hi Drawer',
            })
            setModalProps({
              open: true,
              title: 'Hi Modal',
            })
          }}
        >
          Button
        </button>
      )
    }

    Button.whyDidYouRender = true

    function Component() {
      const { message } = useApp()

      useEffect(() => {
        message.info('Hi')
      }, [])

      ComponentTimes++

      return <div>Component</div>
    }

    Component.whyDidYouRender = true

    const user = userEvent.setup()

    render(
      <App>
        <Container />
      </App>
    )

    expect(screen.getByText('Hi')).toBeDefined()
    expect(ContainerTimes).toBe(1)
    expect(ButtonTimes).toBe(1)
    expect(ComponentTimes).toBe(1)

    await user.click(screen.getByRole('button'))

    expect(await screen.findByText('Hi Drawer')).toBeDefined()
    expect(await screen.findByText('Hi Modal')).toBeDefined()
    expect(ContainerTimes).toBe(1)
    expect(ButtonTimes).toBe(1)
    expect(ComponentTimes).toBe(1)
  })

  it('disable BrowserRouter', () => {
    function Nav() {
      const navigate = useNavigate()

      return (
        <button type='button' onClick={() => navigate('/')}>
          Nav
        </button>
      )
    }

    render(
      <App browserRouterProps={false}>
        <Nav />
      </App>
    )

    expect(
      screen.getByText(/useNavigate\(\) may be used only in the context/)
    ).toBeDefined()

    render(
      <App browserRouterProps={false}>
        <div>OK</div>
      </App>
    )

    expect(screen.getByText('OK')).toBeDefined()
  })

  it('error notification should work', async () => {
    setMock(async () => Error('error message'))

    function Component() {
      const { loading } = useFaas('test', { key: 'value' })

      if (loading) return null

      return <div>test</div>
    }

    render(
      <App faasConfigProviderProps={{ faasClientOptions: {} }}>
        <Component />
      </App>
    )

    expect(await screen.findAllByText('error message')).toHaveLength(2)
  })
})
