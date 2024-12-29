import { Func } from '@faasjs/func'
import { describe, expect, it } from 'vitest'
import { CloudFunction } from '../../index'

describe('validator/in', () => {
  describe('event', () => {
    describe('normal', () => {
      it('should work', async () => {
        const cf = new CloudFunction({
          validator: { event: { rules: { key: { in: [1] } } } },
        })
        const handler = new Func({
          plugins: [cf],
          async handler() { },
        }).export().handler

        await handler({})

        await handler({ key: 1 })

        try {
          await handler({ key: 2 })
        } catch (error: any) {
          expect(error.message).toEqual('[event] key must be in 1.')
        }
      })
    })

    describe('array', () => {
      it('should work', async () => {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: { key: { config: { rules: { sub: { in: [1] } } } } },
            },
          },
        })
        const handler = new Func({
          plugins: [cf],
          async handler() { },
        }).export().handler

        await handler({})

        await handler({ key: [{ sub: 1 }] })

        try {
          await handler({ key: [{ sub: 2 }] })
        } catch (error: any) {
          expect(error.message).toEqual('[event] key.sub must be in 1.')
        }
      })
    })

    describe('object', () => {
      it('should work', async () => {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: { key: { config: { rules: { sub: { in: [1] } } } } },
            },
          },
        })
        const handler = new Func({
          plugins: [cf],
          async handler() { },
        }).export().handler

        await handler({})

        await handler({ key: { sub: 1 } })

        try {
          await handler({ key: { sub: 2 } })
        } catch (error: any) {
          expect(error.message).toEqual('[event] key.sub must be in 1.')
        }
      })
    })
  })
})
