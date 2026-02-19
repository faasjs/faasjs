import { describe, expect, it } from 'vitest'
import { parseFuncFilenameFromStack } from '../index'

describe('parseFuncFilenameFromStack', () => {
  it('parses stack frame with function name and parentheses', () => {
    const stack = [
      'Error',
      '    at Object.<anonymous> (/repo/a.func.ts:12:34)',
      '    at ModuleJob.run (node:internal/modules/esm/module_job:234:25)',
    ].join('\n')

    expect(parseFuncFilenameFromStack(stack)).toEqual('/repo/a.func.ts')
  })

  it('parses stack frame without parentheses', () => {
    const stack = ['Error', '    at /repo/a.func.ts:12:34'].join('\n')

    expect(parseFuncFilenameFromStack(stack)).toEqual('/repo/a.func.ts')
  })

  it('supports windows path in stack frame', () => {
    const stack = ['Error', '    at C:\\repo\\a.func.ts:12:34'].join('\n')

    expect(parseFuncFilenameFromStack(stack)).toEqual('C:\\repo\\a.func.ts')
  })

  it('normalizes file URL to file path', () => {
    const stack = ['Error', '    at file:///repo/a%20file.func.ts:12:34'].join('\n')

    expect(parseFuncFilenameFromStack(stack)).toEqual('/repo/a file.func.ts')
  })

  it('returns undefined when no .func.ts frame exists', () => {
    const stack = ['Error', '    at /repo/a.ts:12:34'].join('\n')

    expect(parseFuncFilenameFromStack(stack)).toBeUndefined()
  })
})
