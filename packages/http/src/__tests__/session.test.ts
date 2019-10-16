import { Func, InvokeData } from '@faasjs/func';
import { Http } from '../index';
import { Session } from '../session';

describe('session', function () {
  describe('read', function () {
    const http = new Http();
    const func = new Func({
      plugins: [http],
      handler (data: InvokeData) {
        return http.session.read(data.event.key);
      }
    });
    func.config = {
      plugins: {
        http: {
          config: {
            cookie: {
              session: {
                key: 'key',
                secret: 'secret'
              }
            }
          }
        }
      }
    };
    const handler = func.export().handler;

    test('return value', async function () {
      const res = await handler({
        headers: {
          cookie: 'key=YUwxU1dBMDc5anlDemY3SHhPSDhHUT09LS1BdGJTSzdHSzhsRGJCcDlMZ05lK0ZnPT0=--6a5edb5edffc49259127b2268a82061f8937b742f541df6ccb283b5ca0e312d6; '
        },
        key: 'key'
      });

      expect(res.body).toEqual('{"data":"value"}');
    });

    test('no value', async function () {
      const res = await handler({
        headers: {
          cookie: 'key=YUwxU1dBMDc5anlDemY3SHhPSDhHUT09LS1BdGJTSzdHSzhsRGJCcDlMZ05lK0ZnPT0=--6a5edb5edffc49259127b2268a82061f8937b742f541df6ccb283b5ca0e312d6; '
        },
        key: 'null'
      });

      expect(res.body).toBeUndefined();
    });

    test('no key', async function () {
      const res = await handler({
        headers: {
          cookie: ''
        },
        key: 'key'
      });

      expect(res.body).toBeUndefined();
    });

    test('wrong session', async function () {
      const res = await handler({
        headers: {
          cookie: 'key=key'
        },
        key: 'key'
      });

      expect(res.body).toBeUndefined();
    });
  });

  describe('write', function () {
    const http = new Http();
    const func = new Func({
      plugins: [http],
      handler (data: InvokeData) {
        http.session.write(data.event.key, data.event.value);
      }
    });
    func.config = {
      plugins: {
        http: {
          config: {
            cookie: {
              session: {
                key: 'key',
                secret: 'secret'
              }
            }
          }
        }
      }
    };
    const handler = func.export().handler;
    const session = new Session(http.cookie, {
      key: 'key',
      secret: 'secret'
    });

    test('add', async function () {
      const res = await handler({
        key: 'key',
        value: 'value',
        headers: {}
      });

      expect(session.decode(res.headers['Set-Cookie'][0].match('(^|;)\\s*key\\s*=\\s*([^;]+)')[2])).toEqual({ key: 'value' });
    });

    test('delete', async function () {
      const res = await handler({
        key: 'key',
        value: null,
        headers: {
          cookie: 'key=YUwxU1dBMDc5anlDemY3SHhPSDhHUT09LS1BdGJTSzdHSzhsRGJCcDlMZ05lK0ZnPT0=--6a5edb5edffc49259127b2268a82061f8937b742f541df6ccb283b5ca0e312d6;'
        }
      });

      expect(session.decode(res.headers['Set-Cookie'][0].match('(^|;)\\s*key\\s*=\\s*([^;]+)')[2])).toEqual({});
    });

    test('multi change', async function () {
      const http = new Http();
      const func = new Func({
        plugins: [http],
        handler () {
          http.session.write('a', 1);
          http.session.write('a', 2);
          http.session.write('b', 1);
        }
      });
      func.config = {
        plugins: {
          http: {
            config: {
              cookie: {
                session: {
                  key: 'key',
                  secret: 'secret'
                }
              }
            }
          }
        }
      };
      const handler = func.export().handler;

      const res = await handler({
        key: 'key',
        value: null
      });

      expect(session.decode(res.headers['Set-Cookie'][0].match('(^|;)\\s*key\\s*=\\s*([^;]+)')[2])).toEqual({
        a: 2,
        b: 1
      });
    });
  });
});
