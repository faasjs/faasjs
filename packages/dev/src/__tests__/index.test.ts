import { describe, expect, it } from 'vitest'
import * as dev from '../index'
import * as pglite from '../pglite'
import * as testKit from '../test'
import * as vite from '../vite'

describe('index exports', () => {
  it('should export vite helpers', () => {
    expect(dev.viteFaasJsServer).toBe(vite.viteFaasJsServer)
  })

  it('should export pglite helpers', () => {
    expect(dev.createPgliteKnex).toBe(pglite.createPgliteKnex)
    expect(dev.mountFaasKnex).toBe(pglite.mountFaasKnex)
    expect(dev.runPgliteSql).toBe(pglite.runPgliteSql)
    expect(dev.runPgliteSqlFile).toBe(pglite.runPgliteSqlFile)
    expect(dev.unmountFaasKnex).toBe(pglite.unmountFaasKnex)
  })

  it('should export test helpers', () => {
    expect(dev.test).toBe(testKit.test)
    expect(dev.FuncWarper).toBe(testKit.FuncWarper)
    expect(dev.streamToString).toBe(testKit.streamToString)
  })
})
