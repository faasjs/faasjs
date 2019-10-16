import Logger from '../index';

describe('logger', function () {
  test.each([
    ['debug', 34],
    ['info', 32],
    ['warn', 33],
    ['error', 31],
  ])('%s', function (level: string, color) {
    const logger = new Logger();
    logger[level]('message');

    expect(logger.lastOutput).toEqual(`\u001b[0${color}m${level.toUpperCase()} message\u001b[39m`);

    logger.label = 'label';
    logger[level]('message');

    expect(logger.lastOutput).toEqual(`\u001b[0${color}m${level.toUpperCase()} [label] message\u001b[39m`);
  });

  test('time', function (done) {
    const logger = new Logger();
    logger.time('key');
    setTimeout(function () {
      logger.timeEnd('key', 'message');

      expect(logger.lastOutput).toMatch(/\u001b\[034mDEBUG message \+[0-9]+ms\u001b\[39m/);
      done();
    });
  });

  test('timeEnd error', function () {
    const logger = new Logger('error');
    logger.timeEnd('key', 'message');

    expect(logger.lastOutput).toEqual('\u001b[031mERROR [error] message\u001b[39m');
  });

  test('error', function () {
    const logger = new Logger();
    logger.error(Error('message'));

    expect(logger.lastOutput.split('\n')[0]).toEqual('\u001b[031mERROR Error: message');
  });

  test('FaasLog', function(){
    const logger = new Logger();
    process.env.FaasLog = 'info';
    logger.debug('debug');

    expect(logger.lastOutput).toBeUndefined();

    logger.info('info');

    expect(logger.lastOutput).toEqual('\u001b[032mINFO info\u001b[39m');

    logger.warn('warn');

    expect(logger.lastOutput).toEqual('\u001b[033mWARN warn\u001b[39m');

    logger.error('error');

    expect(logger.lastOutput).toEqual('\u001b[031mERROR error\u001b[39m');
  });
});
