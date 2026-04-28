import { describe, expect, it } from 'vitest'

import { getRouteFiles } from '../routes'

describe('getRouteFiles', () => {
  it('should work', () => {
    expect(getRouteFiles('/', 'apis')).toEqual([
      'apis.api.ts',
      'apis/index.api.ts',
      'apis/default.api.ts',
    ])

    expect(getRouteFiles('a/', 'a/b/c/apis')).toEqual([
      'a/b/c/apis.api.ts',
      'a/b/c/apis/index.api.ts',
      'a/b/c/apis/default.api.ts',
      'a/b/c/default.api.ts',
      'a/b/default.api.ts',
      'a/default.api.ts',
    ])

    expect(getRouteFiles('a', 'a/b/c/apis/')).toEqual([
      'a/b/c/apis.api.ts',
      'a/b/c/apis/index.api.ts',
      'a/b/c/apis/default.api.ts',
      'a/b/c/default.api.ts',
      'a/b/default.api.ts',
      'a/default.api.ts',
    ])
  })
})
