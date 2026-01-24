import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadPackage, resetRuntime } from '../load_package'

describe('loadPackage', () => {
  let originalRequire: any
  let originalImportMeta: any

  beforeEach(() => {
    originalRequire = globalThis.require
    // @ts-expect-error
    originalImportMeta = globalThis.import?.meta || {}
    vi.resetModules()
    resetRuntime()
  })

  afterEach(() => {
    globalThis.require = originalRequire
    // @ts-expect-error
    globalThis.import = { meta: originalImportMeta }
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
})
