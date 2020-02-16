import { action } from '../commands/new';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

describe('new', function () {
  describe('func', function () {
    afterEach(function () {
      execSync(`rm -rf ${__dirname}/tmp`);
    });
  
    test('basic', function () {
      action('func', 'packages/cli/src/__tests__/tmp/basic', []);

      expect(readFileSync(__dirname + '/tmp/basic.func.ts').toString()).toEqual(`import { Func } from '@faasjs/func';

export default new Func({
  plugins: [],
  async handler (): Promise<any> {
    // let's code
  }
});
`);

      expect(readFileSync(__dirname + '/tmp/__tests__/basic.test.ts').toString()).toEqual(`import { FuncWarpper } from '@faasjs/test';

describe('basic.func.ts', function () {
  test('should work', async function () {
    const func = new FuncWarpper(require.resolve('../basic.func.ts'));

    const res = await func.handler({});

    expect(res).toEqual({});
  });
});
`);
    });

    test('with plugins', function () {
      action('func', 'packages/cli/src/__tests__/tmp/plugin', ['cf', 'http']);

      expect(readFileSync(__dirname + '/tmp/plugin.func.ts').toString()).toEqual(`import { Func } from '@faasjs/func';
import { CloudFunction } from '@faasjs/cloud_function';
import { Http } from '@faasjs/http';

const cf = new CloudFunction({});
const http = new Http({});

export default new Func({
  plugins: [cf, http],
  async handler (): Promise<any> {
    // let's code
  }
});
`);

      expect(readFileSync(__dirname + '/tmp/__tests__/plugin.test.ts').toString()).toEqual(`import { FuncWarpper } from '@faasjs/test';

describe('plugin.func.ts', function () {
  test('should work', async function () {
    const func = new FuncWarpper(require.resolve('../plugin.func.ts'));

    const res = await func.handler({});

    expect(res).toEqual({});
  });
});
`);
    });
  });

  test('unknown type', function () {
    try {
      action('unknown', 'unknown', []);
    } catch (error) {
      expect(error.message).toEqual('Unknown type: unknown (only support func now)');
    }
  });
});
