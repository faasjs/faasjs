import { describe, expect, it } from 'vitest'
import * as dev from '../index'
import * as testKit from '../test'
import * as typegen from '../typegen'
import * as vite from '../vite'

describe('index exports', () => {
  it('should export vite helpers', () => {
    expect(dev.viteFaasJsServer).toBe(vite.viteFaasJsServer)
  })

  it('should export test helpers', () => {
    expect(dev.test).toBe(testKit.test)
    expect(dev.FuncWarper).toBe(testKit.FuncWarper)
    expect(dev.streamToString).toBe(testKit.streamToString)
  })

  it('should export typegen helpers', () => {
    expect(dev.generateFaasTypes).toBe(typegen.generateFaasTypes)
    expect(dev.isTypegenSourceFile).toBe(typegen.isTypegenSourceFile)
  })
})
