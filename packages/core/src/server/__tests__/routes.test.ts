import { describe, expect, it } from 'vitest'

import { getRouteFiles } from '../routes'

describe('getRouteFiles', () => {
  it('should work', () => {
    expect(getRouteFiles('/', 'funcs')).toEqual([
      'funcs.api.ts',
      'funcs/index.api.ts',
      'funcs/default.api.ts',
    ])

    expect(getRouteFiles('a/', 'a/b/c/funcs')).toEqual([
      'a/b/c/funcs.api.ts',
      'a/b/c/funcs/index.api.ts',
      'a/b/c/funcs/default.api.ts',
      'a/b/c/default.api.ts',
      'a/b/default.api.ts',
      'a/default.api.ts',
    ])

    expect(getRouteFiles('a', 'a/b/c/funcs/')).toEqual([
      'a/b/c/funcs.api.ts',
      'a/b/c/funcs/index.api.ts',
      'a/b/c/funcs/default.api.ts',
      'a/b/c/default.api.ts',
      'a/b/default.api.ts',
      'a/default.api.ts',
    ])
  })
})
