import { Func } from '@faasjs/func'
import { describe, expect, it } from 'vitest'
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

      await expect(handler()).resolves.toEqual({ data: 1 })
    })

    it('should work with error', async () => {
      const nextjs = new NextJsPlugin()
      const handler = new Func({
        plugins: [nextjs],
        async handler() {
          throw Error('error')
        },
      }).export().handler

      await expect(handler()).resolves.toEqual({
        error: { message: 'error' },
      })
    })

    it('should work with params', async () => {
      const nextjs = new NextJsPlugin()
      const handler = new Func<{
        a: number
        b: number
      }>({
        plugins: [nextjs],
        async handler({ params }) {
          return { result: params.a + params.b }
        },
      }).export().handler

      await expect(handler({ a: 1, b: 2 })).resolves.toEqual({
        data: { result: 3 },
      })
    })

    it('should work with formData', async () => {
      const nextjs = new NextJsPlugin()
      const handler = new Func({
        plugins: [nextjs],
        async handler({ params }) {
          return { result: params.a + params.b }
        },
      }).export().handler

      const formData = new FormData()
      formData.append('a', '1')
      formData.append('b', '2')

      await expect(handler(formData)).resolves.toEqual({
        data: { result: '12' },
      })
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

    it('should work with params', async () => {
      await expect(
        useFuncWithNextJsPlugin<{
          a: number
          b: number
        }>(async ({ params }) => ({ result: params.a + params.b }))({
          a: 1,
          b: 2,
        })
      ).resolves.toEqual({
        data: { result: 3 },
      })
    })

    it('should work with formData', async () => {
      const formData = new FormData()
      formData.append('a', '1')
      formData.append('b', '2')

      await expect(
        useFuncWithNextJsPlugin(async ({ params, logger }) => {
          logger.debug('params: %j', params)

          return {
            result: params.a + params.b,
          }
        })(formData)
      ).resolves.toEqual({
        data: { result: '12' },
      })
    })
  })
})
