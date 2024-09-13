import { Func } from '@faasjs/func'
import { NextJsPlugin, useFuncWithNextJsPlugin } from '../plugin'

describe('NextJsPlugin', () => {
  describe('class style', () => {
    it('should work', async () => {
      const nextjs = new NextJsPlugin()
      const handler = new Func({
        plugins: [nextjs],
        async handler() {
          return 1
        },
      }).export().handler

      const res = await handler({})

      expect(res).toEqual({ data: 1 })
    })

    it('should work with error', async () => {
      const nextjs = new NextJsPlugin()
      const handler = new Func({
        plugins: [nextjs],
        async handler() {
          throw Error('error')
        },
      }).export().handler

      const res = await handler({})

      expect(res).toEqual({ error: { message: 'error' } })
    })
  })

  describe('useFuncWithNextJsPlugin', () => {
    it('should work', async () => {
      await expect(useFuncWithNextJsPlugin(async () => 1)()).resolves.toEqual({
        data: 1,
      })
    })

    it('should work with error', async () => {
      await expect(
        useFuncWithNextJsPlugin(async () => {
          throw Error('error')
        })()
      ).resolves.toEqual({
        error: { message: 'error' },
      })
    })
  })
})
