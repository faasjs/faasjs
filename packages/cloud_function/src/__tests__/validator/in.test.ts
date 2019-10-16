import { Func } from '@faasjs/func';
import { CloudFunction } from '../../index';

describe('validator/in', function () {
  describe('event', function () {
    describe('normal', function () {
      test('should work', async function () {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  in: [1]
                }
              }
            }
          }
        });
        const handler = new Func({
          plugins: [cf],
          handler() { }
        }).export().handler;

        await handler({});

        await handler({
          key: 1
        });

        try {
          await handler({
            key: 2
          });
        } catch (error) {
          expect(error.message).toEqual('[event] key must be in 1.');
        }
      });
    });

    describe('array', function () {
      test('should work', async function () {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    rules: {
                      sub: {
                        in: [1]
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
          handler() { }
        }).export().handler;

        await handler({});

        await handler({
          key: [{ sub: 1 }]
        });

        try {
          await handler({
            key: [{ sub: 2 }]
          });
        } catch (error) {
          expect(error.message).toEqual('[event] key.sub must be in 1.');
        }
      });
    });

    describe('object', function () {
      test('should work', async function () {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    rules: {
                      sub: {
                        in: [1]
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
          handler() { }
        }).export().handler;

        await handler({});

        await handler({
          key: { sub: 1 }
        });

        try {
          await handler({
            key: { sub: 2 }
          });
        } catch (error) {
          expect(error.message).toEqual('[event] key.sub must be in 1.');
        }
      });
    });
  });
});
