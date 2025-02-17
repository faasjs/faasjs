import { expect, it } from 'vitest'
import * as All from '..'

it('should work', () => {
  expect(Object.keys(All)).toEqual([
    'Color',
    'LevelColor',
    'colorfy',
    'formatLogger',
    'Logger',
    'Transport',
    'getTransport',
  ])
})
