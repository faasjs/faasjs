import { expect, it } from 'vitest'
import * as Exports from '../index'

it('exports', () => {
  expect(Object.keys(Exports)).toEqual([
    'useMiddleware',
    'useMiddlewares',
    'staticHandler',
    'getAll',
    'closeAll',
    'getRouteFiles',
    'Server',
  ])
})
