import { describe, expect, it } from 'vitest'

import { toErrorMessage } from '..'

describe('toErrorMessage', () => {
  it('should work', () => {
    expect(toErrorMessage(Error('test'))).toBe('test')

    expect(toErrorMessage(Error())).toBe('Unknown error')

    expect(toErrorMessage(Error(), 'fallback')).toBe('fallback')
  })
})
