import { describe, expect, it } from 'vitest'

import * as dev from '../../index'
import * as testKit from '../../testing/index'
import * as typegen from '../../typegen/index'
import * as vite from '../../vite/index'

describe('index exports', () => {
  it('should export vite helpers', () => {
    expect(dev.viteFaasJsServer).toBe(vite.viteFaasJsServer)
    expect(dev.ViteConfig).toBe(vite.ViteConfig)
    expect(dev.OxfmtConfig).toBe(vite.OxfmtConfig)
    expect(dev.OxlintConfig).toBe(vite.OxlintConfig)
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
