import { describe, expect, it } from 'vitest'
import { getRouteFiles } from '../routes'

describe('getRouteFiles', () => {
  it('should work', () => {
    expect(getRouteFiles('/', 'funcs')).toEqual([
      'funcs.func.ts',
      'funcs.func.tsx',
      'funcs/index.func.ts',
      'funcs/index.func.tsx',
      'funcs/default.func.ts',
      'funcs/default.func.tsx',
    ])

    expect(getRouteFiles('a/', 'a/b/c/funcs')).toEqual([
      'a/b/c/funcs.func.ts',
      'a/b/c/funcs.func.tsx',
      'a/b/c/funcs/index.func.ts',
      'a/b/c/funcs/index.func.tsx',
      'a/b/c/funcs/default.func.ts',
      'a/b/c/funcs/default.func.tsx',
      'a/b/c/default.func.ts',
      'a/b/c/default.func.tsx',
      'a/b/default.func.ts',
      'a/b/default.func.tsx',
      'a/default.func.ts',
      'a/default.func.tsx',
    ])
  })
})
