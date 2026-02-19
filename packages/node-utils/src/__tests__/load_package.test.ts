import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { detectNodeRuntime, loadPackage, resetRuntime } from '../load_package'

describe('loadPackage', () => {
  let originalRequire: any
  let originalProcess: any

  beforeEach(() => {
    originalRequire = globalThis.require
    originalProcess = globalThis.process
    vi.resetModules()
    resetRuntime()
  })

  afterEach(() => {
    globalThis.require = originalRequire
    globalThis.process = originalProcess
    resetRuntime()
  })

  it('should load a module', async () => {
    // @ts-expect-error
    globalThis.require = vi.fn().mockImplementation((name: string) => {
      if (name === 'my-module') return { default: 'my-module-default' }
    })
    const result = await loadPackage('my-module')
    expect(result).toBe('my-module-default')
  })

  it('should load a module with default name', async () => {
    // @ts-expect-error
    globalThis.require = vi.fn().mockImplementation((name: string) => {
      if (name === 'my-module') return { test: 'my-module-default' }
    })
    const result = await loadPackage('my-module', 'test')
    expect(result).toBe('my-module-default')
  })

  it('should load a module with default name list', async () => {
    // @ts-expect-error
    globalThis.require = vi.fn().mockImplementation((name: string) => {
      if (name === 'my-module') return { test: 'my-module-default' }
    })
    const result = await loadPackage('my-module', ['default', 'test'])
    expect(result).toBe('my-module-default')
  })

  it('should load esm module when require is unavailable', async () => {
    // @ts-expect-error
    globalThis.require = undefined

    const path = await import('node:path')
    const result = await loadPackage<string>('node:path', 'sep')

    expect(result).toBe(path.sep)
  })

  it('should throw when runtime cannot be detected', () => {
    // @ts-expect-error
    globalThis.require = undefined
    // @ts-expect-error
    globalThis.process = undefined

    expect(() => detectNodeRuntime()).toThrow('Unknown runtime')
  })
})
