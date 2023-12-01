import { Func } from '@faasjs/func'
import { CloudFunction } from '../../index'

describe('validator/default', () => {
  describe('event', () => {
    describe('normal', () => {
      test('const', async () => {
        const cf = new CloudFunction({
          validator: { event: { rules: { key: { default: 1 } } } },
        })
        const handler = new Func({
          plugins: [cf],
          async handler() {
            return cf.event.key
          },
        }).export().handler

        const res = await handler({})

        expect(res).toEqual(1)
      })

      test('function', async () => {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  default(request: any) {
                    return request.event.i + 1
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

        const res = await handler({ i: 1 })

        expect(res).toEqual(2)
      })
    })

    describe('array', () => {
      test('const', async () => {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: { key: { config: { rules: { sub: { default: 1 } } } } },
            },
          },
        })
        const handler = new Func({
          plugins: [cf],
          async handler() {
            return cf.event.key
          },
        }).export().handler

        const res = await handler({ key: [{}] })

        expect(res).toEqual([{ sub: 1 }])
      })

      test('function', async () => {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    rules: {
                      sub: { default: (request: any) => request.event.i + 1 },
                    },
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
          key: [{}],
          i: 1,
        })

        expect(res).toEqual([{ sub: 2 }])
      })
    })

    describe('object', () => {
      test('const', async () => {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: { key: { config: { rules: { sub: { default: 1 } } } } },
            },
          },
        })
        const handler = new Func({
          plugins: [cf],
          async handler() {
            return cf.event.key
          },
        }).export().handler

        const res = await handler({ key: {} })

        expect(res).toEqual({ sub: 1 })
      })

      test('function', async () => {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    rules: {
                      sub: { default: (request: any) => request.event.i + 1 },
                    },
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
          key: {},
          i: 1,
        })

        expect(res).toEqual({ sub: 2 })
      })
    })
  })
})
