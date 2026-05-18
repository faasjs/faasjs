import { describe, expect, it } from 'vitest'

import { colorize, LevelColor, supportsColorizeOutput } from '../../color'

describe('colorize', () => {
  it('should colorize debug level message', () => {
    const message = 'Debug message'
    const result = colorize('debug', message)
    expect(result).toBe(`\u001b[0${LevelColor.debug}m${message}\u001b[39m`)
  })

  it('should colorize info level message', () => {
    const message = 'Info message'
    const result = colorize('info', message)
    expect(result).toBe(`\u001b[0${LevelColor.info}m${message}\u001b[39m`)
  })

  it('should colorize warn level message', () => {
    const message = 'Warn message'
    const result = colorize('warn', message)
    expect(result).toBe(`\u001b[0${LevelColor.warn}m${message}\u001b[39m`)
  })

  it('should colorize error level message', () => {
    const message = 'Error message'
    const result = colorize('error', message)
    expect(result).toBe(`\u001b[0${LevelColor.error}m${message}\u001b[39m`)
  })
})

describe('supportsColorizeOutput', () => {
  it('should require a tty by default', () => {
    expect(supportsColorizeOutput({ isTTY: true }, {})).toBe(true)
    expect(supportsColorizeOutput({ isTTY: false }, {})).toBe(false)
    expect(supportsColorizeOutput(undefined, undefined)).toBe(false)
  })

  it('should respect explicit environment overrides', () => {
    expect(supportsColorizeOutput({ isTTY: false }, { FORCE_COLOR: '1' })).toBe(true)
    expect(supportsColorizeOutput({ isTTY: true }, { FORCE_COLOR: '0' })).toBe(false)
    expect(supportsColorizeOutput({ isTTY: true }, { NO_COLOR: '' })).toBe(false)
    expect(supportsColorizeOutput({ isTTY: true }, { TERM: 'dumb' })).toBe(false)
  })
})
