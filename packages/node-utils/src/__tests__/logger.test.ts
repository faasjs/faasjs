import { describe, expect, it, vi } from 'vitest'
import { Color } from '../color'
import { type Level, formatLogger, Logger } from '../logger'

let lastOutput = ''

function fake(text: string): void {
  lastOutput = text
  console.log(text)
}

describe('logger', () => {
  it.each([
    ['debug', Color.GRAY],
    ['info', Color.GREEN],
    ['warn', Color.ORANGE],
  ])('%s', (level: string, color: number) => {
    const logger = new Logger()
    logger.stdout = fake
    logger.stderr = fake
    logger.silent = false
    logger.level = 'debug'
    logger[level as Level]('message')

    expect(lastOutput).toContain(`\u001b[0${color}m${level.toUpperCase()} message\u001b[39m`)

    logger.label = 'label'
    logger[level as Level]('message')

    expect(lastOutput).toContain(
      `\u001b[0${color}m${level.toUpperCase()} [label] message\u001b[39m`,
    )
  })

  it('error', () => {
    const logger = new Logger()
    logger.stdout = fake
    logger.stderr = fake
    logger.silent = false
    logger.level = 'debug'
    logger.error('message')

    expect(lastOutput).toContain('ERROR message')

    logger.label = 'label'
    logger.error('message')

    expect(lastOutput).toContain('ERROR [label] message')
  })

  it('time', async () => {
    const logger = new Logger()
    logger.stdout = fake
    logger.stderr = fake
    logger.silent = false
    logger.level = 'debug'
    logger.time('key')

    await new Promise((resolve) =>
      setTimeout(() => {
        logger.timeEnd('key', 'message')

        expect(lastOutput).toMatch(/DEBUG message \+[0-9]+ms/)

        resolve(null)
      }, 100),
    )
  })

  it('timeEnd error', () => {
    const logger = new Logger('error')
    logger.stdout = fake
    logger.stderr = fake
    logger.silent = false
    logger.level = 'debug'
    logger.timeEnd('key', 'message')

    expect(lastOutput).toContain('\u001b[090mDEBUG [error] message\u001b[39m')
  })

  it('error', () => {
    const logger = new Logger()
    logger.stdout = fake
    logger.stderr = fake
    logger.silent = false
    logger.level = 'debug'
    logger.error(Error('message'))

    expect(lastOutput).toContain('ERROR Error: message')
  })

  it('FaasLog', () => {
    const logger = new Logger()
    logger.stdout = fake
    logger.stderr = fake
    logger.silent = false
    logger.level = 'info'
    logger.debug('debug')

    expect(lastOutput).not.toContain('debug')

    logger.info('info')

    expect(lastOutput).toContain('\u001b[032mINFO info\u001b[39m')

    logger.warn('warn')

    expect(lastOutput).toContain('\u001b[033mWARN warn\u001b[39m')

    logger.error('error')

    expect(lastOutput).toContain('ERROR error')
  })

  it('formatLogger should fallback when formatting fails', () => {
    const circular: any = {}
    circular.self = circular

    expect(formatLogger('%j', circular)).toContain('[Unable to format]')
  })

  it('raw should write output unless logger is silent', () => {
    const logger = new Logger()
    logger.stdout = fake
    logger.silent = false

    logger.raw('hello %s', 'world')
    expect(lastOutput).toContain('hello world')

    lastOutput = ''
    logger.silent = true
    logger.raw('skip')
    expect(lastOutput).toBe('')
  })

  it('should respect constructor environment flags', () => {
    const original = {
      FaasLog: process.env.FaasLog,
      FaasLogMode: process.env.FaasLogMode,
      FaasMode: process.env.FaasMode,
      FaasLogSize: process.env.FaasLogSize,
      FaasLogTransport: process.env.FaasLogTransport,
      npm_config_argv: process.env.npm_config_argv,
    }

    try {
      process.env.FaasLogMode = 'plain'
      const plain = new Logger()
      expect(plain.colorfyOutput).toBe(false)

      process.env.FaasLogMode = 'pretty'
      const pretty = new Logger()
      expect(pretty.colorfyOutput).toBe(true)

      delete process.env.FaasLogMode
      process.env.FaasMode = 'remote'
      const remote = new Logger()
      expect(remote.colorfyOutput).toBe(false)

      process.env.FaasLog = 'WARN'
      process.env.FaasLogSize = '12'
      process.env.FaasLogTransport = 'true'
      const configured = new Logger()
      expect(configured.level).toBe('warn')
      expect(configured.size).toBe(12)
      expect(configured.disableTransport).toBe(false)

      delete process.env.FaasLog
      process.env.npm_config_argv = JSON.stringify({ original: ['--silent'] })
      const silent = new Logger()
      expect(silent.silent).toBe(true)
    } finally {
      for (const key of Object.keys(original) as Array<keyof typeof original>) {
        const value = original[key]

        if (typeof value === 'undefined') delete process.env[key]
        else process.env[key] = value
      }
    }
  })

  it('should work when process is unavailable', () => {
    const originalProcess = globalThis.process

    try {
      // @ts-expect-error
      globalThis.process = undefined

      const logger = new Logger('no-process')

      expect(logger.label).toBe('no-process')
      expect(logger.silent).toBe(false)
    } finally {
      globalThis.process = originalProcess
    }
  })

  it('should drop empty messages and truncate long plain logs', () => {
    const logger = new Logger()
    const stdout = vi.fn()

    logger.stdout = stdout
    logger.stderr = stdout
    logger.disableTransport = true
    logger.silent = false
    logger.level = 'debug'

    logger.info('')
    expect(stdout).not.toHaveBeenCalled()

    logger.colorfyOutput = false
    logger.info('line1\nline2')
    expect(stdout).toHaveBeenLastCalledWith('INFO line1line2')

    logger.size = 120
    logger.debug('x'.repeat(600))
    expect(stdout).toHaveBeenLastCalledWith(expect.stringContaining('[truncated]'))
  })
})
