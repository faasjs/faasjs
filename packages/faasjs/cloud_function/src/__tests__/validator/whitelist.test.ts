import { Func } from '@faasjs/func';
import { CloudFunction } from '../../index';

describe('validator/whitelist', function () {
  describe('event', function () {
    describe('normal', function () {
      test('error', async function () {
        const cf = new CloudFunction({
          validator: {
            event: {
              whitelist: 'error',
              rules: {
                key: {}
              }
            }
          }
        });
        const handler = new Func({
          plugins: [cf],
          handler() { }
        }).export().handler;

        await handler({});

        try {
          await handler({
            key: 1,
            key2: 2,
            key3: 3
          });
        } catch (error) {
          expect(error.message).toEqual('[event] Unpermitted keys: key2, key3');
        }
      });

      test('ignore', async function () {
        const cf = new CloudFunction({
          validator: {
            event: {
              whitelist: 'ignore',
              rules: {
                key: {}
              }
            }
          }
        });
        const handler = new Func({
          plugins: [cf],
          handler() {
            return cf.event;
          }
        }).export().handler;

        const res = await handler({
          key: 1,
          key2: 2,
          key3: 3
        });

        expect(res).toEqual({ key: 1 });
      });

      test('allow context', async function () {
        const cf = new CloudFunction({
          validator: {
            event: {
              whitelist: 'error',
              rules: {
                key: {}
              }
            }
          }
        });
        const handler = new Func({
          plugins: [cf],
          handler() { }
        }).export().handler;

        await handler({
          key: 1,
          context: {}
        });
      })
    });

    describe('array', function () {
      test('error', async function () {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    whitelist: 'error',
                    rules: {
                      sub: {}
                    }
                  }
                }
              }
            }
          }
        });
        const handler = new Func({
          plugins: [cf],
          handler() { }
        }).export().handler;

        await handler({
          key: [{ sub: 1 }]
        });

        try {
          await handler({
            key: [{ key1: 1, key2: 2 }]
          });
        } catch (error) {
          expect(error.message).toEqual('[event] Unpermitted keys: key.key1, key.key2');
        }
      });

      test('ignore', async function () {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    whitelist: 'ignore',
                    rules: {
                      sub: {}
                    }
                  }
                }
              }
            }
          }
        });
        const handler = new Func({
          plugins: [cf],
          handler() {
            return cf.event.key;
          }
        }).export().handler;

        const res = await handler({
          key: [{ sub: 1, key: 2 }]
        });

        expect(res).toEqual([{ "sub": 1 }]);
      });
    });

    describe('object', function () {
      test('error', async function () {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    whitelist: 'error',
                    rules: {
                      sub: {}
                    }
                  }
                }
              }
            }
          }
        });
        const handler = new Func({
          plugins: [cf],
          handler() { }
        }).export().handler;

        await handler({
          key: { sub: 1 }
        });

        try {
          await handler({
            key: { key1: 1, key2: 2 }
          });
        } catch (error) {
          expect(error.message).toEqual('[event] Unpermitted keys: key.key1, key.key2');
        }
      });

      test('ignore', async function () {
        const http = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    whitelist: 'ignore',
                    rules: {
                      sub: {}
                    }
                  }
                }
              }
            }
          }
        });
        const handler = new Func({
          plugins: [http],
          handler() {
            return http.event.key;
          }
        }).export().handler;

        const res = await handler({
          key: { sub: 1, key: 2 }
        });

        expect(res).toEqual({ sub: 1 });
      });
    });
  });
});
