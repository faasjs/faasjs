import { createElement } from 'react'
import { describe, expect, it } from 'vitest'

import { resolvePageModule, resolvePageQuery, type PageModule } from '../routing'

function createPage(overrides: Partial<PageModule> = {}): PageModule {
  return {
    default: () => createElement('main', null, 'page'),
    ...overrides,
  }
}

describe('routing', () => {
  it('matches the root page before the root fallback', () => {
    const rootIndex = createPage()
    const rootDefault = createPage()
    const page = resolvePageModule(
      {
        './pages/index.tsx': rootIndex,
        './pages/default.tsx': rootDefault,
      },
      '/',
      {},
    )

    expect(page).toEqual({
      module: rootIndex,
      context: {
        pathname: '/',
        query: {},
        basePath: '/',
        restPath: '',
      },
    })
  })

  it('walks up fallback pages for nested routes', () => {
    const docsFallback = createPage()
    const page = resolvePageModule(
      {
        './pages/docs/default.tsx': docsFallback,
      },
      '/docs/react/routing',
      {},
    )

    expect(page).toEqual({
      module: docsFallback,
      context: {
        pathname: '/docs/react/routing',
        query: {},
        basePath: '/docs',
        restPath: '/react/routing',
      },
    })
  })

  it('parses repeated query parameters into arrays', () => {
    expect(resolvePageQuery('?name=React&tag=routing&tag=pages')).toEqual({
      name: 'React',
      tag: ['routing', 'pages'],
    })
  })
})
