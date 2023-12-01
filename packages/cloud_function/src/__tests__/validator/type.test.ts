import { Func } from '@faasjs/func'
import { CloudFunction } from '../../index'

describe('validator/type', () => {
  describe('event', () => {
    describe('normal', () => {
      test.each([
        ['string', 'string'],
        ['boolean', false],
        ['number', 0],
        ['array', []],
      ])('is %p', async (type, value) => {
        const http = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  type: type as
                    | 'string'
                    | 'boolean'
                    | 'number'
                    | 'array'
                    | 'object',
                },
              },
            },
          },
        })
        const handler = new Func({
          plugins: [http],
          async handler() {},
        }).export().handler

        await handler({ key: value })

        try {
          await handler({ key: {} })
        } catch (error: any) {
          expect(error.message).toEqual(`[event] key must be a ${type}.`)
        }
      })
    })

    describe('array', () => {
      test.each([
        ['string', 'string'],
        ['boolean', false],
        ['number', 0],
        ['array', []],
      ])('is %p', async (type, value) => {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    rules: {
                      sub: {
                        type: type as
                          | 'string'
                          | 'boolean'
                          | 'number'
                          | 'array'
                          | 'object',
                      },
                    },
                  },
                },
              },
            },
          },
        })
        const handler = new Func({
          plugins: [cf],
          async handler() {},
        }).export().handler

        await handler({ key: [{ sub: value }] })

        try {
          await handler({ key: [{ sub: {} }] })
        } catch (error: any) {
          expect(error.message).toEqual(`[event] key.sub must be a ${type}.`)
        }
      })
    })

    describe('object', () => {
      test.each([
        ['string', 'string'],
        ['boolean', false],
        ['number', 0],
        ['array', []],
      ])('is %p', async (type, value) => {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: {
                  config: {
                    rules: {
                      sub: {
                        type: type as
                          | 'string'
                          | 'boolean'
                          | 'number'
                          | 'array'
                          | 'object',
                      },
                    },
                  },
                },
              },
            },
          },
        })
        const handler = new Func({
          plugins: [cf],
          async handler() {},
        }).export().handler

        await handler({ key: { sub: value } })

        try {
          await handler({ key: { sub: {} } })
        } catch (error: any) {
          expect(error.message).toEqual(`[event] key.sub must be a ${type}.`)
        }
      })
    })
  })
})
