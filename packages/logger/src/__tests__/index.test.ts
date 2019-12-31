import Logger from '../index';

let lastOutput = '';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
process.stdout.write = (function (write) {
  return function (string, ...args) {
    write.apply(process.stdout, args);
    lastOutput = string;
  };
})(process.stdout.write);

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
process.stderr.write = (function (write) {
  return function (string, ...args) {
    write.apply(process.stdout, args);
    lastOutput = string;
  };
})(process.stderr.write);

describe('logger', function () {
  test.each([
    ['debug', 34],
    ['info', 32],
    ['warn', 33],
  ])('%s', function (level: string, color) {
    const logger = new Logger();
    logger.silent = false;
    logger.level = 0;
    logger[level as string]('message');

    expect(lastOutput).toContain(`\u001b[0${color}m${level.toUpperCase()} message\u001b[39m`);

    logger.label = 'label';
    logger[level as string]('message');

    expect(lastOutput).toContain(`\u001b[0${color}m${level.toUpperCase()} [label] message\u001b[39m`);
  });

  test('error', function () {
    const logger = new Logger();
    logger.silent = false;
    logger.level = 0;
    logger.error('message');

    expect(lastOutput).toContain('ERROR message');

    logger.label = 'label';
    logger.error('message');

    expect(lastOutput).toContain('ERROR [label] message');
  });

  test('time', function (done) {
    const logger = new Logger();
    logger.silent = false;
    logger.level = 0;
    logger.time('key');
    setTimeout(function () {
      logger.timeEnd('key', 'message');

      // eslint-disable-next-line no-control-regex
      expect(lastOutput).toMatch(/\u001b\[034mDEBUG message \+[0-9]+ms\u001b\[39m/);
      done();
    });
  });

  test('timeEnd error', function () {
    const logger = new Logger('error');
    logger.silent = false;
    logger.level = 0;
    logger.timeEnd('key', 'message');

    expect(lastOutput).toContain('\u001b[034mDEBUG [error] message\u001b[39m');
  });

  test('error', function () {
    const logger = new Logger();
    logger.silent = false;
    logger.level = 0;
    logger.error(Error('message'));

    expect(lastOutput).toContain('ERROR Error: message');
  });

  test('FaasLog', function () {
    const logger = new Logger();
    logger.silent = false;
    logger.level = 1;
    logger.debug('debug');

    expect(lastOutput).not.toContain('debug');

    logger.info('info');

    expect(lastOutput).toContain('\u001b[032mINFO info\u001b[39m');

    logger.warn('warn');

    expect(lastOutput).toContain('\u001b[033mWARN warn\u001b[39m');

    logger.error('error');

    expect(lastOutput).toContain('ERROR error');
  });
});
