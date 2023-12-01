import { action } from '../commands/new'
import { readFileSync } from 'fs'
import { execSync } from 'child_process'

describe('new', () => {
  describe('func', () => {
    afterEach(() => {
      execSync(`rm -rf ${__dirname}/tmp`)
    })

    test('basic', () => {
      action('func', 'packages/cli/src/__tests__/tmp/basic', [])

      expect(
        readFileSync(`${__dirname}/tmp/basic.func.ts`).toString()
      ).toEqual(`import { useFunc } from '@faasjs/func';

export default useFunc(function () {

  return async function () {
    // let's code
  }
});
`)

      expect(
        readFileSync(`${__dirname}/tmp/__tests__/basic.test.ts`).toString()
      ).toEqual(`import { FuncWarper } from '@faasjs/test';

describe('basic.func.ts', function () {
  test('should work', async function () {
    const func = new FuncWarper(require.resolve('../basic.func.ts'));

    const res = await func.handler({});

    expect(res).toEqual({});
  });
});
`)
    })

    test('with plugins', () => {
      action('func', 'packages/cli/src/__tests__/tmp/plugin', ['cf', 'http'])

      expect(
        readFileSync(`${__dirname}/tmp/plugin.func.ts`).toString()
      ).toEqual(`import { useFunc } from '@faasjs/func';
import { useCloudFunction } from '@faasjs/cloud_function';
import { useHttp } from '@faasjs/http';

export default useFunc(function () {
  const cf = useCloudFunction();
  const http = useHttp();

  return async function () {
    // let's code
  }
});
`)

      expect(
        readFileSync(`${__dirname}/tmp/__tests__/plugin.test.ts`).toString()
      ).toEqual(`import { FuncWarper } from '@faasjs/test';

describe('plugin.func.ts', function () {
  test('should work', async function () {
    const func = new FuncWarper(require.resolve('../plugin.func.ts'));

    const res = await func.handler({});

    expect(res).toEqual({});
  });
});
`)
    })
  })

  test('unknown type', () => {
    try {
      action('unknown', 'unknown', [])
    } catch (error: any) {
      expect(error.message).toEqual(
        'Unknown type: unknown (only support func now)'
      )
    }
  })
})
