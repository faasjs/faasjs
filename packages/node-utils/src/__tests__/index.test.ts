import { expect, it } from 'vitest'

import * as nodeUtils from '../index'

it('should export helpers', () => {
  expect(nodeUtils).toHaveProperty('Color')
  expect(nodeUtils).toHaveProperty('LevelColor')
  expect(nodeUtils).toHaveProperty('colorfy')
  expect(nodeUtils).toHaveProperty('loadConfig')
  expect(nodeUtils).toHaveProperty('loadFunc')
  expect(nodeUtils).toHaveProperty('loadPackage')
  expect(nodeUtils).toHaveProperty('parseYaml')
  expect(nodeUtils).toHaveProperty('registerNodeModuleHooks')
  expect(nodeUtils).toHaveProperty('detectNodeRuntime')
  expect(nodeUtils).toHaveProperty('formatLogger')
  expect(nodeUtils).toHaveProperty('isPathInsideRoot')
  expect(nodeUtils).toHaveProperty('Logger')
  expect(nodeUtils).toHaveProperty('Transport')
  expect(nodeUtils).toHaveProperty('getTransport')
})
