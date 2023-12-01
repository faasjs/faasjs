import { Func } from '@faasjs/func'
import { CloudFunction } from '../../index'

describe('validator/required', () => {
  describe('event', () => {
    test('normal', async () => {
      const cf = new CloudFunction({
        validator: { event: { rules: { key: { required: true } } } },
      })
      const handler = new Func({
        plugins: [cf],
        async handler() {},
      }).export().handler

      await handler({ key: 1 })

      try {
        await handler({})
      } catch (error: any) {
        expect(error.message).toEqual('[event] key is required.')
      }
    })

    describe('array', () => {
      test('empty', async () => {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: { config: { rules: { sub: { required: true } } } },
              },
            },
          },
        })
        const handler = new Func({
          plugins: [cf],
          async handler() {},
        }).export().handler

        await handler({})

        await handler({ key: [] })
      })

      test('plain object', async () => {
        const cf = new CloudFunction({
          validator: {
            event: {
              rules: {
                key: { config: { rules: { sub: { required: true } } } },
              },
            },
          },
        })
        const handler = new Func({
          plugins: [cf],
          async handler() {},
        }).export().handler

        await handler({})

        try {
          await handler({ key: [{}] })
        } catch (error: any) {
          expect(error.message).toEqual('[event] key.sub is required.')
        }
      })
    })

    test('object', async () => {
      const http = new CloudFunction({
        validator: {
          event: {
            rules: { key: { config: { rules: { sub: { required: true } } } } },
          },
        },
      })
      const handler = new Func({
        plugins: [http],
        async handler() {},
      }).export().handler

      await handler({})

      try {
        await handler({ key: {} })
      } catch (error: any) {
        expect(error.message).toEqual('[event] key.sub is required.')
      }
    })
  })
})
