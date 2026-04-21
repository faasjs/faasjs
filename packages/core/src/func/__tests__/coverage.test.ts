import { describe, expect, it } from 'vitest'

import { Func, parseApiFilenameFromStack } from '..'

describe('Func coverage', () => {
  it('should handle empty and malformed stack frames', () => {
    expect(parseApiFilenameFromStack()).toBeUndefined()
    expect(parseApiFilenameFromStack('Error\n    at demo.ts:1:1')).toBeUndefined()
    expect(parseApiFilenameFromStack('Error\n    at file://bad%.api.ts:1:1')).toBe(
      'file://bad%.api.ts',
    )
  })

  it('should normalize missing invoke data before calling the next function', async () => {
    class UnnamedPlugin {
      public readonly type = 'invoke'
      public readonly name = undefined as any

      public async onInvoke(data: any, next: () => Promise<void>) {
        expect(data.context.request_at).toBeTypeOf('string')
        await next()
      }
    }

    const func = new Func({
      plugins: [new UnnamedPlugin() as any],
      async handler() {
        return 'tail'
      },
    })
    const data = {
      config: func.config,
      response: undefined,
      handler: func.handler,
    } as any

    await func.invoke(data)

    expect(data.context.request_at).toBeTypeOf('string')
    expect(data.response).toBe('tail')
  })

  it('should allow mount with null data and reuse the function config', async () => {
    const func = new Func({
      async handler() {
        return 'ok'
      },
    })

    await func.mount(null as any)

    expect(func.mounted).toBe(true)
    expect(func.config.plugins).toBeDefined()
  })

  it('should derive request metadata from headers when exporting handlers', async () => {
    const handler = new Func({
      async handler({ context }) {
        return {
          request_id: context.request_id,
          request_at: context.request_at,
          callbackWaitsForEmptyEventLoop: context.callbackWaitsForEmptyEventLoop,
        }
      },
    }).export().handler

    await expect(
      handler(
        {
          headers: {
            'x-faasjs-request-id': 'req-1',
          },
        } as any,
        undefined,
      ),
    ).resolves.toEqual({
      request_id: 'req-1',
      request_at: expect.any(String),
      callbackWaitsForEmptyEventLoop: false,
    })
  })
})
