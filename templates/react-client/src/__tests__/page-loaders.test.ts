import { describe, expect, it } from 'vite-plus/test'

import { loader as notFoundLoader } from '../pages/default'
import { loader as docsLoader } from '../pages/docs/default'
import { loader as homeLoader } from '../pages/index'

describe('page loaders', () => {
  it('loads greeting props from the home page query', async () => {
    const result = await homeLoader({
      pathname: '/',
      query: {
        name: 'React',
      },
      basePath: '/',
      restPath: '',
    })

    expect(result.props).toEqual({
      initialName: 'React',
      initialMessage: 'Hello, React!',
    })
  })

  it('returns the unmatched docs rest path', async () => {
    const result = await docsLoader({
      restPath: '/react/ssr',
    })

    expect(result.props).toEqual({
      restPath: '/react/ssr',
    })
  })

  it('returns 404 props for the fallback page', async () => {
    const result = await notFoundLoader({
      pathname: '/missing',
      query: {},
      basePath: '/',
      restPath: '/missing',
    })

    expect(result).toEqual({
      statusCode: 404,
      props: {
        pathname: '/missing',
      },
    })
  })
})
