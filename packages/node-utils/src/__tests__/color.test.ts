import { describe, expect, it } from 'vitest'
import { colorfy, LevelColor } from '../color'

describe('colorfy', () => {
  it('should colorfy debug level message', () => {
    const message = 'Debug message'
    const result = colorfy('debug', message)
    expect(result).toBe(`\u001b[0${LevelColor.debug}m${message}\u001b[39m`)
  })

  it('should colorfy info level message', () => {
    const message = 'Info message'
    const result = colorfy('info', message)
    expect(result).toBe(`\u001b[0${LevelColor.info}m${message}\u001b[39m`)
  })

  it('should colorfy warn level message', () => {
    const message = 'Warn message'
    const result = colorfy('warn', message)
    expect(result).toBe(`\u001b[0${LevelColor.warn}m${message}\u001b[39m`)
  })

  it('should colorfy error level message', () => {
    const message = 'Error message'
    const result = colorfy('error', message)
    expect(result).toBe(`\u001b[0${LevelColor.error}m${message}\u001b[39m`)
  })
})
