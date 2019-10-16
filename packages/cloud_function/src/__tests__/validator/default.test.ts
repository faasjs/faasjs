import { Func } from '@faasjs/func';
import { CloudFunction } from '../../index';

describe('validator/default', function () {
  describe('event', function () {
    describe('normal', function () {
      test('const', async function () {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  default: 1
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

        const res = await handler({});

        expect(res).toEqual(1);
      });

      test('function', async function () {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  default(request) {
                    return request.event.i + 1;
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
          i: 1
        });

        expect(res).toEqual(2);
      });
    });

    describe('array', function () {
      test('const', async function () {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    rules: {
                      sub: {
                        default: 1
                      }
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
          key: [{}]
        });

        expect(res).toEqual([{ sub: 1 }]);
      });

      test('function', async function () {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    rules: {
                      sub: {
                        default: (request) => request.event.i + 1
                      }
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
          key: [{}],
          i: 1
        });

        expect(res).toEqual([{ sub: 2 }]);
      });
    });

    describe('object', function () {
      test('const', async function () {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    rules: {
                      sub: {
                        default: 1
                      }
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
          key: {}
        });

        expect(res).toEqual({ sub: 1 });
      });

      test('function', async function () {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    rules: {
                      sub: {
                        default: (request) => request.event.i + 1
                      }
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
          key: {},
          i: 1
        });

        expect(res).toEqual({ sub: 2 });
      });
    });
  });
});
