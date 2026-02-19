import { describe, expect, it } from 'vitest'
import { format } from '../format'

describe('format', () => {
  it('should format string with %s', () => {
    expect(format('Hello %s', 'world')).toBe('Hello world')
  })

  it('should format string with %d', () => {
    expect(format('Number: %d', 42)).toBe('Number: 42')
  })

  it('should format string with %j', () => {
    expect(format('JSON: %j', { key: 'value' })).toBe('JSON: {"key":"value"}')
  })

  it('should format string with %o for array', () => {
    expect(format('Array: %o', [1, 2, 3])).toBe('Array: [1,2,3]')
  })

  it('should format string with multiple placeholders', () => {
    expect(format('Hello %s, you have %d new messages', 'Alice', 5)).toBe(
      'Hello Alice, you have 5 new messages',
    )
  })

  it('should escape %% to %', () => {
    expect(format('100%% sure')).toBe('100% sure')
  })

  it('should handle extra arguments', () => {
    expect(format('Hello %s', 'world', 'extra')).toBe('Hello world extra')
  })

  it('should handle no arguments', () => {
    expect(format('Hello world')).toBe('Hello world')
  })

  it('should handle escaped %', () => {
    expect(format('Hello %%s', 'world')).toBe('Hello %s world')
  })

  it('should handle error', () => {
    const error = new Error('Test error')
    expect(format('', error)).toBe(' Error: Test error')
  })
})
