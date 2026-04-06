import { describe, expect, it } from 'vitest'

import * as dev from '..'
import * as testKit from '../testing'
import * as typegen from '../typegen'
import * as vite from '../vite'

describe('index exports', () => {
  it('should export vite helpers', () => {
    expect(dev.viteFaasJsServer).toBe(vite.viteFaasJsServer)
    expect(dev.viteConfig).toBe(vite.viteConfig)
    expect(dev.oxfmtConfig).toBe(vite.oxfmtConfig)
    expect(dev.oxlintConfig).toBe(vite.oxlintConfig)
  })

  it('should export test helpers', () => {
    expect(dev.test).toBe(testKit.test)
    expect(dev.FuncWarper).toBe(testKit.FuncWarper)
  })

  it('should export typegen helpers', () => {
    expect(dev.generateFaasTypes).toBe(typegen.generateFaasTypes)
    expect(dev.isTypegenSourceFile).toBe(typegen.isTypegenSourceFile)
  })
})
