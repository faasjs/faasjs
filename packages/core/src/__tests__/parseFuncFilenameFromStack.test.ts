import { describe, expect, it } from 'vitest'

import { parseApiFilenameFromStack, parseFuncFilenameFromStack } from '..'

describe('parseApiFilenameFromStack', () => {
  it('parses stack frame with function name and parentheses', () => {
    const stack = [
      'Error',
      '    at Object.<anonymous> (/repo/a.api.ts:12:34)',
      '    at ModuleJob.run (node:internal/modules/esm/module_job:234:25)',
    ].join('\n')

    expect(parseApiFilenameFromStack(stack)).toEqual('/repo/a.api.ts')
  })

  it('parses stack frame without parentheses', () => {
    const stack = ['Error', '    at /repo/a.api.ts:12:34'].join('\n')

    expect(parseApiFilenameFromStack(stack)).toEqual('/repo/a.api.ts')
  })

  it('supports windows path in stack frame', () => {
    const stack = ['Error', '    at C:\\repo\\a.api.ts:12:34'].join('\n')

    expect(parseApiFilenameFromStack(stack)).toEqual('C:\\repo\\a.api.ts')
  })

  it('normalizes file URL to file path', () => {
    const stack = ['Error', '    at file:///repo/a%20file.api.ts:12:34'].join('\n')

    expect(parseApiFilenameFromStack(stack)).toEqual('/repo/a file.api.ts')
  })

  it('returns undefined when no .api.ts frame exists', () => {
    const stack = ['Error', '    at /repo/a.ts:12:34'].join('\n')

    expect(parseApiFilenameFromStack(stack)).toBeUndefined()
  })
})

describe('parseFuncFilenameFromStack', () => {
  it('keeps the deprecated alias wired to .api.ts parsing', () => {
    const stack = ['Error', '    at /repo/legacy.api.ts:12:34'].join('\n')

    expect(parseFuncFilenameFromStack(stack)).toEqual('/repo/legacy.api.ts')
  })
})
