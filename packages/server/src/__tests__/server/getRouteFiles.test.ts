import { describe, expect, it } from 'vitest'
import { getRouteFiles } from '../../server'

describe('getRouteFiles', () => {
  it('should work', () => {
    expect(getRouteFiles('', 'funcs')).toEqual([
      'funcs.func.ts',
      'funcs.func.tsx',
      'funcs/index.func.ts',
      'funcs/index.func.tsx',
      'funcs/default.func.ts',
      'funcs/default.func.tsx',
      'default.func.ts',
      'default.func.tsx',
    ])
  })
})
