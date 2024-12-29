import { expect, it } from 'vitest'
import * as load from '../index'

it('should work', () => {
  expect(load).toHaveProperty('loadConfig')
})
