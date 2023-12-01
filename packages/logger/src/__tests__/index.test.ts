import { Logger, Color, Level } from '../index'

let lastOutput = ''

function fake(text: string): void {
  lastOutput = text
}

describe('logger', () => {
  test.each([
    ['debug', Color.GRAY],
    ['info', Color.GREEN],
    ['warn', Color.ORANGE],
  ])('%s', (level: string, color: number) => {
    const logger = new Logger()
    logger.stdout = fake
    logger.stderr = fake
    logger.silent = false
    logger.level = 0
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

  test('error', () => {
    const logger = new Logger()
    logger.stdout = fake
    logger.stderr = fake
    logger.silent = false
    logger.level = 0
    logger.error('message')

    expect(lastOutput).toContain('ERROR message')

    logger.label = 'label'
    logger.error('message')

    expect(lastOutput).toContain('ERROR [label] message')
  })

  test('time', async () => {
    const logger = new Logger()
    logger.stdout = fake
    logger.stderr = fake
    logger.silent = false
    logger.level = 0
    logger.time('key')

    await new Promise(resolve =>
      setTimeout(() => {
        logger.timeEnd('key', 'message')

        expect(lastOutput).toMatch(/DEBUG message \+[0-9]+ms/)

        resolve(null)
      }, 100)
    )
  })

  test('timeEnd error', () => {
    const logger = new Logger('error')
    logger.stdout = fake
    logger.stderr = fake
    logger.silent = false
    logger.level = 0
    logger.timeEnd('key', 'message')

    expect(lastOutput).toContain('\u001b[090mDEBUG [error] message\u001b[39m')
  })

  test('error', () => {
    const logger = new Logger()
    logger.stdout = fake
    logger.stderr = fake
    logger.silent = false
    logger.level = 0
    logger.error(Error('message'))

    expect(lastOutput).toContain('ERROR Error: message')
  })

  test('FaasLog', () => {
    const logger = new Logger()
    logger.stdout = fake
    logger.stderr = fake
    logger.silent = false
    logger.level = 1
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
