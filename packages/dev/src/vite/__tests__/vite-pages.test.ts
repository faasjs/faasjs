import type { Plugin } from 'vite'
import { describe, expect, it } from 'vitest'

import { viteFaasJsServer } from '..'

function runHook<Args extends unknown[], Result>(
  hook: Plugin[keyof Plugin],
  ...args: Args
): Result {
  if (typeof hook === 'function') return hook(...args) as Result
  if (hook && typeof hook === 'object' && 'handler' in hook) return hook.handler(...args) as Result

  throw Error('Missing Vite hook.')
}

describe('viteFaasJsServer virtual pages module', () => {
  it('should expose the virtual:faasjs-pages module', () => {
    const plugin = viteFaasJsServer()

    expect(runHook<string[], string>(plugin.resolveId, 'virtual:faasjs-pages')).toBe(
      '\0virtual:faasjs-pages',
    )

    const code = runHook<string[], string>(plugin.load, '\0virtual:faasjs-pages')

    expect(code).toContain('import.meta.glob')
    expect(code).toContain('/src/pages/index.tsx')
    expect(code).toContain('/src/pages/**/default.tsx')
    expect(code).toContain("file.replace(/^\\/src\\/pages/, './pages')")
  })
})
