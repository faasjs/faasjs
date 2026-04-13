import { describe, expect, it } from 'vite-plus/test'

import { getCurrentPathname, getDocsRestPath, getHomePageState } from '../routing/route-data'

describe('route data', () => {
  it('loads greeting state from the current search string', () => {
    expect(getHomePageState('?name=React')).toEqual({
      initialName: 'React',
      initialMessage: 'Hello, React!',
    })
  })

  it('returns the unmatched docs rest path', () => {
    expect(getDocsRestPath('/docs/react/routing')).toBe('/react/routing')
    expect(getDocsRestPath('/docs')).toBe('/')
  })

  it('returns the current pathname with a stable root fallback', () => {
    expect(getCurrentPathname('/missing')).toBe('/missing')
    expect(getCurrentPathname('')).toBe('/')
  })
})
