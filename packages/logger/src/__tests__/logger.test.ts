import { describe, expect, it, } from 'vitest'
import { Color } from '../color'
import { type Level, Logger, } from '../logger'

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

    expect(lastOutput).toContain(
      `\u001b[0${color}m${level.toUpperCase()} message\u001b[39m`
    )

    logger.label = 'label'
    logger[level as Level]('message')

    expect(lastOutput).toContain(
      `\u001b[0${color}m${level.toUpperCase()} [label] message\u001b[39m`
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

    await new Promise(resolve =>
      setTimeout(() => {
        logger.timeEnd('key', 'message')

        expect(lastOutput).toMatch(/DEBUG message \+[0-9]+ms/)

        resolve(null)
      }, 100)
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
})
