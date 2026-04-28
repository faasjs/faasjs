import { describe, expect, it } from 'vitest'

import * as dev from '../../index'
import * as testKit from '../../testing/index'
import * as typegen from '../../typegen/index'
import * as vite from '../../vite/index'

describe('index exports', () => {
  it('should export vite helpers', () => {
    expect(dev.viteFaasJsServer).toBe(vite.viteFaasJsServer)
    expect(dev.viteConfig).toBe(vite.viteConfig)
    expect(dev.oxfmtConfig).toBe(vite.oxfmtConfig)
    expect(dev.oxlintConfig).toBe(vite.oxlintConfig)
  })

  it('should export test helpers', () => {
    expect(dev.testApi).toBe(testKit.testApi)
    expect(dev.ApiTester).toBe(testKit.ApiTester)
  })

  it('should export typegen helpers', () => {
    expect(dev.generateFaasTypes).toBe(typegen.generateFaasTypes)
    expect(dev.isTypegenInputFile).toBe(typegen.isTypegenInputFile)
  })
})
