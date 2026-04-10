import { createElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const render = vi.fn<(element: unknown) => void>()
  const createRoot = vi.fn<(root: HTMLElement) => { render: typeof render }>(() => ({
    render,
  }))
  const hydrateRoot = vi.fn<(root: HTMLElement, element: unknown) => void>()

  return {
    createRoot,
    hydrateRoot,
    render,
  }
})

vi.mock('react-dom/client', () => ({
  createRoot: mocks.createRoot,
  hydrateRoot: mocks.hydrateRoot,
}))

import type { AutoPagesWindow, PageLoaderContext, PageModules } from '../auto_pages'
import { bootstrapAutoPages } from '../auto_pages_client_runtime'

describe('bootstrapAutoPages', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('hydrates from the serialized SSR payload', async () => {
    const root = {
      innerHTML: '<main>Hello SSR</main>',
    } as HTMLElement
    const pageModules: PageModules = {
      './pages/index.tsx': {
        default: (props: { message: string }) => createElement('main', null, props.message),
      },
    }
    const currentWindow = {
      __FAASJS_REACT_SSR__: {
        props: {
          message: 'Hello SSR',
        },
      },
      location: {
        pathname: '/',
        search: '',
      },
    } as unknown as AutoPagesWindow

    await bootstrapAutoPages({
      pageModules,
      root,
      window: currentWindow,
    })

    expect(mocks.createRoot).not.toHaveBeenCalled()
    expect(mocks.hydrateRoot).toHaveBeenCalledTimes(1)
    expect(mocks.hydrateRoot.mock.calls[0][0]).toBe(root)
    expect(mocks.hydrateRoot.mock.calls[0][1]).toMatchObject({
      props: {
        message: 'Hello SSR',
      },
      type: pageModules['./pages/index.tsx'].default,
    })
  })

  it('loads props on the client when the SSR payload is missing', async () => {
    const root = {
      innerHTML: '',
    } as HTMLElement
    const loader = vi.fn<(context: PageLoaderContext) => Promise<{ props: { message: string } }>>(
      async ({ query }) => {
        const name = Array.isArray(query.name) ? query.name.join(',') : query.name

        return {
          props: {
            message: `Hello ${name}`,
          },
        }
      },
    )
    const pageModules: PageModules = {
      './pages/index.tsx': {
        default: (props: { message: string }) => createElement('main', null, props.message),
        loader,
      },
    }
    const currentWindow = {
      location: {
        pathname: '/',
        search: '?name=Client',
      },
    } as unknown as AutoPagesWindow

    await bootstrapAutoPages({
      pageModules,
      root,
      window: currentWindow,
    })

    expect(loader).toHaveBeenCalledWith({
      pathname: '/',
      query: {
        name: 'Client',
      },
      basePath: '/',
      restPath: '',
    })
    expect(mocks.hydrateRoot).not.toHaveBeenCalled()
    expect(mocks.createRoot).toHaveBeenCalledWith(root)
    expect(mocks.render).toHaveBeenCalledTimes(1)
    expect(mocks.render.mock.calls[0][0]).toMatchObject({
      props: {
        message: 'Hello Client',
      },
      type: pageModules['./pages/index.tsx'].default,
    })
  })
})
