import { Func } from '@faasjs/func'
import { CloudFunction } from '../../index'

describe('validator/type', function () {
  describe('event', function () {
    describe('normal', function () {
      test.each([
        ['string', 'string'],
        ['boolean', false],
        ['number', 0],
        ['array', []]
      ])('is %p', async function (type, value) {
        const http = new CloudFunction({ validator: { event: { rules: { key: { type: type as 'string' | 'boolean' | 'number' | 'array' | 'object' } } } } })
        const handler = new Func({
          plugins: [http],
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          async handler () { }
        }).export().handler

        await handler({ key: value })

        try {
          await handler({ key: {} })
        } catch (error) {
          expect(error.message).toEqual(`[event] key must be a ${type}.`)
        }
      })
    })

    describe('array', function () {
      test.each([
        ['string', 'string'],
        ['boolean', false],
        ['number', 0],
        ['array', []]
      ])('is %p', async function (type, value) {
        const cf = new CloudFunction({ validator: { event: { rules: { key: { config: { rules: { sub: { type: type as 'string' | 'boolean' | 'number' | 'array' | 'object' } } } } } } } })
        const handler = new Func({
          plugins: [cf],
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          async handler () { }
        }).export().handler

        await handler({ key: [{ sub: value }] })

        try {
          await handler({ key: [{ sub: {} }] })
        } catch (error) {
          expect(error.message).toEqual(`[event] key.sub must be a ${type}.`)
        }
      })
    })

    describe('object', function () {
      test.each([
        ['string', 'string'],
        ['boolean', false],
        ['number', 0],
        ['array', []]
      ])('is %p', async function (type, value) {
        const cf = new CloudFunction({ validator: { event: { rules: { key: { config: { rules: { sub: { type: type as 'string' | 'boolean' | 'number' | 'array' | 'object' } } } } } } } })
        const handler = new Func({
          plugins: [cf],
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          async handler () { }
        }).export().handler

        await handler({ key: { sub: value } })

        try {
          await handler({ key: { sub: {} } })
        } catch (error) {
          expect(error.message).toEqual(`[event] key.sub must be a ${type}.`)
        }
      })
    })
  })
})
