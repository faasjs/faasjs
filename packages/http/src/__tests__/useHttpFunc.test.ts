import {
  type InvokeData,
  type Next,
  type Plugin,
  usePlugin,
} from '@faasjs/func'
import type { InferFaasAction } from '@faasjs/types'
import { expectType } from 'tsd'
import { useHttpFunc } from '..'

describe('useHttpFunc', () => {
  it('should work with extra plugins', async () => {
    class DemoPlugin implements Plugin {
      public readonly type = 'P'
      public readonly name = 'P'

      public async onInvoke({ event }: InvokeData, next: Next) {
        event.params.counter++
        await next()
      }
    }

    function useDemoPlugin() {
      const p = new DemoPlugin()
      usePlugin(p)
      return p
    }

    const func = useHttpFunc<{
      counter: number
    }>(() => {
      useDemoPlugin()

      return async ({ params }) => {
        params.counter++
        return params.counter
      }
    })

    const res = await func.export().handler({ params: { counter: 0 } })

    expect(res.body).toEqual(JSON.stringify({ data: 2 }))

    type InferredAction = InferFaasAction<typeof func>

    expectType<InferredAction['Params']>({ counter: 0 })
    expectType<InferredAction['Data']>(2)
  })

  it('should work with cookie', async () => {
    const func = useHttpFunc(
      () =>
        async ({ cookie, session }) => {
          cookie.write('a', '1')
          return cookie.read('a') + session.read('key')
        },
      {
        http: {
          config: {
            cookie: {
              session: {
                key: 'key',
                secret: 'secret',
              },
            },
          },
        },
      }
    )

    const res = await func.export().handler({
      headers: {
        cookie:
          'a=2; b=2; key=YUwxU1dBMDc5anlDemY3SHhPSDhHUT09LS1BdGJTSzdHSzhsRGJCcDlMZ05lK0ZnPT0=--6a5edb5edffc49259127b2268a82061f8937b742f541df6ccb283b5ca0e312d6;',
      },
    })

    expect(res.body).toEqual(JSON.stringify({ data: '1value' }))
  })
})
