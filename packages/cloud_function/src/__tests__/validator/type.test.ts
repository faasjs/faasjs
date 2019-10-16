import { Func } from '@faasjs/func';
import { CloudFunction } from '../../index';

describe('validator/type', function () {
  describe('event', function () {
    describe('normal', function () {
      test.each([['string', 'string'], ['boolean', false], ['number', 0], ['array', []]])('is %p', async function (type: 'string' | 'boolean' | 'number' | 'array' | 'object', value) {
        const http = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  type
                }
              }
            }
          }
        });
        const handler = new Func({
          plugins: [http],
          handler() { }
        }).export().handler;

        await handler({
          key: value
        });

        try {
          await handler({
            key: {}
          });
        } catch (error) {
          expect(error.message).toEqual(`[event] key must be a ${type}.`);
        }
      });
    });

    describe('array', function () {
      test.each([['string', 'string'], ['boolean', false], ['number', 0], ['array', []]])('is %p', async function (type: 'string' | 'boolean' | 'number' | 'array' | 'object', value) {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    rules: {
                      sub: {
                        type
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

        await handler({
          key: [{ sub: value }]
        });

        try {
          await handler({
            key: [{ sub: {} }]
          });
        } catch (error) {
          expect(error.message).toEqual(`[event] key.sub must be a ${type}.`);
        }
      });
    });

    describe('object', function () {
      test.each([['string', 'string'], ['boolean', false], ['number', 0], ['array', []]])('is %p', async function (type: 'string' | 'boolean' | 'number', value) {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    rules: {
                      sub: {
                        type
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

        await handler({
          key: { sub: value }
        });

        try {
          await handler({
            key: { sub: {} }
          });
        } catch (error) {
          expect(error.message).toEqual(`[event] key.sub must be a ${type}.`);
        }
      });
    });
  });
});
