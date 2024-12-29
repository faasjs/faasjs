import { Func } from '@faasjs/func'
import { describe, expect, it } from 'vitest'
import { CloudFunction } from '../../index'

describe('validator/whitelist', () => {
  describe('event', () => {
    describe('normal', () => {
      it('error', async () => {
        const cf = new CloudFunction({
          validator: {
            event: {
              whitelist: 'error',
              rules: { key: {} },
            },
          },
        })
        const handler = new Func({
          plugins: [cf],
          async handler() { },
        }).export().handler

        await handler({})

        try {
          await handler({
            key: 1,
            key2: 2,
            key3: 3,
          })
        } catch (error: any) {
          expect(error.message).toEqual(
            '[event] Not permitted keys: key2, key3'
          )
        }
      })

      it('ignore', async () => {
        const cf = new CloudFunction({
          validator: {
            event: {
              whitelist: 'ignore',
              rules: { key: {} },
            },
          },
        })
        const handler = new Func({
          plugins: [cf],
          async handler() {
            return cf.event
          },
        }).export().handler

        const res = await handler({
          key: 1,
          key2: 2,
          key3: 3,
        })

        expect(res).toEqual({ key: 1 })
      })

      it('allow context', async () => {
        const cf = new CloudFunction({
          validator: {
            event: {
              whitelist: 'error',
              rules: { key: {} },
            },
          },
        })
        const handler = new Func({
          plugins: [cf],
          async handler() { },
        }).export().handler

        await handler({
          key: 1,
          context: {},
        })
      })
    })

    describe('array', () => {
      it('error', async () => {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    whitelist: 'error',
                    rules: { sub: {} },
                  },
                },
              },
            },
          },
        })
        const handler = new Func({
          plugins: [cf],
          async handler() { },
        }).export().handler

        await handler({ key: [{ sub: 1 }] })

        try {
          await handler({
            key: [
              {
                key1: 1,
                key2: 2,
              },
            ],
          })
        } catch (error: any) {
          expect(error.message).toEqual(
            '[event] Not permitted keys: key.key1, key.key2'
          )
        }
      })

      it('ignore', async () => {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    whitelist: 'ignore',
                    rules: { sub: {} },
                  },
                },
              },
            },
          },
        })
        const handler = new Func({
          plugins: [cf],
          async handler() {
            return cf.event.key
          },
        }).export().handler

        const res = await handler({
          key: [
            {
              sub: 1,
              key: 2,
            },
          ],
        })

        expect(res).toEqual([{ sub: 1 }])
      })
    })

    describe('object', () => {
      it('error', async () => {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    whitelist: 'error',
                    rules: { sub: {} },
                  },
                },
              },
            },
          },
        })
        const handler = new Func({
          plugins: [cf],
          async handler() { },
        }).export().handler

        await handler({ key: { sub: 1 } })

        try {
          await handler({
            key: {
              key1: 1,
              key2: 2,
            },
          })
        } catch (error: any) {
          expect(error.message).toEqual(
            '[event] Not permitted keys: key.key1, key.key2'
          )
        }
      })

      it('ignore', async () => {
        const http = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    whitelist: 'ignore',
                    rules: { sub: {} },
                  },
                },
              },
            },
          },
        })
        const handler = new Func({
          plugins: [http],
          async handler() {
            return http.event.key
          },
        }).export().handler

        const res = await handler({
          key: {
            sub: 1,
            key: 2,
          },
        })

        expect(res).toEqual({ sub: 1 })
      })
    })
  })
})
