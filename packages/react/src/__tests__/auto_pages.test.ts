import { createElement } from 'react'
import { describe, expect, it } from 'vitest'

import {
  resolvePageModule,
  resolvePageQuery,
  type PageModule,
  type PageModules,
} from '../auto_pages'
import { renderPage } from '../auto_pages_server_runtime'

function createPage<Props = Record<string, unknown>>(
  overrides: Partial<PageModule<Props>> = {},
): PageModule<Props> {
  return {
    default: ((props: Props) => createElement('main', null, JSON.stringify(props))) as any,
    ...overrides,
  }
}

describe('auto pages', () => {
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
      '/docs/react/ssr',
      {},
    )

    expect(page).toEqual({
      module: docsFallback,
      context: {
        pathname: '/docs/react/ssr',
        query: {},
        basePath: '/docs',
        restPath: '/react/ssr',
      },
    })
  })

  it('parses repeated query parameters into arrays', () => {
    expect(resolvePageQuery('?name=React&tag=ssr&tag=pages')).toEqual({
      name: 'React',
      tag: ['ssr', 'pages'],
    })
  })

  it('renders the matched page with loader props', async () => {
    const pageModules: PageModules = {
      './pages/index.tsx': createPage<{ message: string }>({
        default: (props) => createElement('main', null, props.message),
        loader: async ({ query }) => {
          const name = Array.isArray(query.name) ? query.name.join(',') : query.name

          return {
            headers: {
              'x-powered-by': 'faasjs',
            },
            statusCode: 201,
            props: {
              message: `Hello, ${name}`,
            },
          }
        },
      }),
    }

    const result = await renderPage(pageModules, {
      pathname: '/',
      query: {
        name: 'React',
      },
    })

    expect(result).toEqual({
      headers: {
        'x-powered-by': 'faasjs',
      },
      statusCode: 201,
      props: {
        message: 'Hello, React',
      },
      html: '<main>Hello, React</main>',
    })
  })
})
