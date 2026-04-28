import { expect, it } from 'vitest'

import * as utils from '../../index'

it('should export helpers', () => {
  expect(utils).toHaveProperty('deepMerge')
  expect(utils).toHaveProperty('streamToString')
  expect(utils).toHaveProperty('streamToObject')
  expect(utils).toHaveProperty('stringToStream')
  expect(utils).toHaveProperty('objectToStream')
})
