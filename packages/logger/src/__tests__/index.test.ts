import Logger from '../index';

let lastOutput = '';

process.stdout.write = (function (write) {
  return function (string) {
    write.apply(process.stdout, arguments)
    lastOutput = string;
  }
})(process.stdout.write);

process.stderr.write = (function (write) {
  return function (string) {
    write.apply(process.stdout, arguments)
    lastOutput = string;
  }
})(process.stderr.write);


describe('logger', function () {
  test.each([
    ['debug', 34],
    ['info', 32],
    ['warn', 33],
  ])('%s', function (level: string, color) {
    const logger = new Logger();
    logger[level]('message');

    expect(lastOutput).toContain(`\u001b[0${color}m${level.toUpperCase()} message\u001b[39m`);

    logger.label = 'label';
    logger[level]('message');

    expect(lastOutput).toContain(`\u001b[0${color}m${level.toUpperCase()} [label] message\u001b[39m`);
  });

  test('error', function () {
    const logger = new Logger();
    logger.error('message');

    expect(lastOutput).toContain(`ERROR message\u001b[39m`);

    logger.label = 'label';
    logger.error('message');

    expect(lastOutput).toContain(`ERROR [label] message\u001b[39m`);
  });

  test('time', function (done) {
    const logger = new Logger();
    logger.time('key');
    setTimeout(function () {
      logger.timeEnd('key', 'message');

      expect(lastOutput).toMatch(/\u001b\[034mDEBUG message \+[0-9]+ms\u001b\[39m/);
      done();
    });
  });

  test('timeEnd error', function () {
    const logger = new Logger('error');
    logger.timeEnd('key', 'message');

    expect(lastOutput).toContain('\u001b[034mDEBUG [error] message\u001b[39m');
  });

  test('error', function () {
    const logger = new Logger();
    logger.error(Error('message'));

    expect(lastOutput).toContain('ERROR Error: message');
  });

  test('FaasLog', function () {
    process.env.FaasLog = 'info';

    const logger = new Logger();
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
