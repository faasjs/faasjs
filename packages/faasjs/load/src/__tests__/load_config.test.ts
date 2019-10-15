import loadConfig from '../load_config';

describe('loadConfig', function () {
  test('defaults', function () {
    const config = loadConfig(process.cwd() + '/src/__tests__/', process.cwd() + '/src/__tests__/fake.func.ts').defaults;

    expect(config.plugins.test.type).toEqual('defaults');
    expect(config.plugins.func.provider).toEqual(config.providers.tc);
    expect(config.plugins.func.name).toEqual('func');
  });

  test('local', function () {
    const config = loadConfig(process.cwd() + '/src/__tests__/', process.cwd() + '/src/__tests__/fake.func.ts').local;

    expect(config.plugins.func.type).toEqual('function');
    expect(config.plugins.func.provider).toEqual(config.providers.tc);
    expect(config.plugins.func.name).toEqual('func');

    expect(config.plugins.test.type).toEqual('local');
    expect(config.plugins.func.config.env).toEqual('defaults');
  });

  test('sub local', function () {
    const config = loadConfig(process.cwd() + '/src/__tests__', process.cwd() + '/src/__tests__/sub/fake.func.ts').local;

    expect(config.plugins.func.type).toEqual('function');
    expect(config.plugins.func.provider).toEqual(config.providers.tc);
    expect(config.plugins.func.name).toEqual('func');

    expect(config.plugins.test.type).toEqual('sublocal');
  });
});
