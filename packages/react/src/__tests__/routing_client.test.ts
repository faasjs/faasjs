import { createElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const render = vi.fn<(element: unknown) => void>()
  const createRoot = vi.fn<(root: HTMLElement) => { render: typeof render }>(() => ({
    render,
  }))

  return {
    createRoot,
    render,
  }
})

vi.mock('react-dom/client', () => ({
  createRoot: mocks.createRoot,
}))

import type { PageModules, RoutingWindow } from '../routing'
import { bootstrapRouting } from '../routing_client_runtime'

describe('bootstrapRouting', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('mounts the matched page with createRoot', async () => {
    const root = {
      innerHTML: '<main>Old HTML</main>',
    } as HTMLElement
    const pageModules: PageModules = {
      './pages/index.tsx': {
        default: () => createElement('main', null, 'Hello routing'),
      },
    }
    const currentWindow = {
      location: {
        pathname: '/',
        search: '',
      },
    } as unknown as RoutingWindow

    await bootstrapRouting({
      pageModules,
      root,
      window: currentWindow,
    })

    expect(root.innerHTML).toBe('')
    expect(mocks.createRoot).toHaveBeenCalledWith(root)
    expect(mocks.render).toHaveBeenCalledTimes(1)
    expect(mocks.render.mock.calls[0][0]).toMatchObject({
      props: {},
      type: pageModules['./pages/index.tsx'].default,
    })
  })

  it('returns the resolved route context while rendering the page without props', async () => {
    const root = {
      innerHTML: '',
    } as HTMLElement
    const pageModules: PageModules = {
      './pages/index.tsx': {
        default: () => createElement('main', null, 'Hello Client'),
      },
    }
    const currentWindow = {
      location: {
        pathname: '/',
        search: '?name=Client',
      },
    } as unknown as RoutingWindow

    const page = await bootstrapRouting({
      pageModules,
      root,
      window: currentWindow,
    })

    expect(page.context).toEqual({
      pathname: '/',
      query: {
        name: 'Client',
      },
      basePath: '/',
      restPath: '',
    })
    expect(mocks.createRoot).toHaveBeenCalledWith(root)
    expect(mocks.render).toHaveBeenCalledTimes(1)
    expect(mocks.render.mock.calls[0][0]).toMatchObject({
      props: {},
      type: pageModules['./pages/index.tsx'].default,
    })
  })
})
