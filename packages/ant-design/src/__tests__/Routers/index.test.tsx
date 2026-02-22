import { act, render, screen } from '@testing-library/react'
import { type JSX, type LazyExoticComponent, type ComponentType } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ConfigProvider } from '../../Config'
import { PageNotFound, lazy, Routes } from '../../Routers'

describe('Routers', () => {
  it('PageNotFound should read text from theme', () => {
    render(
      <ConfigProvider theme={{ common: { pageNotFound: 'Route Missing' } }}>
        <PageNotFound />
      </ConfigProvider>,
    )

    expect(screen.getByText('Route Missing')).toBeDefined()
  })

  it('should render route element and custom notFound', () => {
    render(
      <ConfigProvider>
        <MemoryRouter initialEntries={['/home']}>
          <Routes
            routes={[
              {
                path: '/home',
                element: <div>Home</div>,
              },
            ]}
            notFound={<div>Custom 404</div>}
          />
        </MemoryRouter>
      </ConfigProvider>,
    )

    expect(screen.getByText('Home')).toBeDefined()
    expect(screen.queryByText('Custom 404')).toBeNull()
  })

  it('should render default notFound page', () => {
    render(
      <ConfigProvider theme={{ common: { pageNotFound: 'No Match' } }}>
        <MemoryRouter initialEntries={['/missing']}>
          <Routes routes={[{ path: '/home', element: <div>Home</div> }]} />
        </MemoryRouter>
      </ConfigProvider>,
    )

    expect(screen.getByText('No Match')).toBeDefined()
  })

  it('should allow route with no element and no page', () => {
    const { container } = render(
      <ConfigProvider>
        <MemoryRouter initialEntries={['/empty']}>
          <Routes routes={[{ path: '/empty' }]} notFound={<div>Custom 404</div>} />
        </MemoryRouter>
      </ConfigProvider>,
    )

    expect(screen.queryByText('Custom 404')).toBeNull()
    expect(container.querySelector('.ant-result')).toBeNull()
  })

  it('should render custom fallback for lazy page', async () => {
    let resolvePage: ((value: { default: ComponentType }) => void) | undefined

    const LazyPage = lazy(
      () =>
        new Promise<{ default: ComponentType }>((resolve) => {
          resolvePage = resolve
        }),
    ) as LazyExoticComponent<ComponentType<any>>

    render(
      <ConfigProvider>
        <MemoryRouter initialEntries={['/lazy']}>
          <Routes
            fallback={<div>Loading Custom</div>}
            routes={[
              {
                path: '/lazy',
                page: LazyPage,
              },
            ]}
          />
        </MemoryRouter>
      </ConfigProvider>,
    )

    expect(screen.getByText('Loading Custom')).toBeDefined()

    if (!resolvePage) throw Error('lazy page resolver not initialized')
    const resolver = resolvePage

    await act(async () => {
      resolver({
        default: function Page(): JSX.Element {
          return <div>Lazy Page</div>
        },
      })
    })

    expect(await screen.findByText('Lazy Page')).toBeDefined()
  })

  it('should render default fallback for lazy page', async () => {
    let resolvePage: ((value: { default: ComponentType }) => void) | undefined

    const LazyPage = lazy(
      () =>
        new Promise<{ default: ComponentType }>((resolve) => {
          resolvePage = resolve
        }),
    ) as LazyExoticComponent<ComponentType<any>>

    const { container } = render(
      <ConfigProvider>
        <MemoryRouter initialEntries={['/lazy-default']}>
          <Routes
            routes={[
              {
                path: '/lazy-default',
                page: LazyPage,
              },
            ]}
          />
        </MemoryRouter>
      </ConfigProvider>,
    )

    expect(container.querySelector('.ant-skeleton')).not.toBeNull()

    if (!resolvePage) throw Error('lazy page resolver not initialized')
    const resolver = resolvePage

    await act(async () => {
      resolver({
        default: function Page(): JSX.Element {
          return <div>Lazy Default</div>
        },
      })
    })

    expect(await screen.findByText('Lazy Default')).toBeDefined()
  })
})
