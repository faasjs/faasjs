import { type Plugin, type InvokeData, type Next, Func } from '@faasjs/func'
import type { Logger } from '@faasjs/logger'

export class NextJsPlugin implements Plugin {
  readonly type = 'NextJs'
  readonly name = 'NextJs'

  async onInvoke(data: InvokeData, next: Next) {
    if (data.event instanceof FormData) {
      data.logger.warn(
        '[NextJsPlugin] FormData is not recommended, because it only supports string or blob values.'
      )

      data.params = {}
      for (const [key, value] of data.event.entries()) {
        data.params[key] = value
      }
    } else {
      data.params = data.event
    }

    data.logger.debug('Params: %j', data.params)

    await next()

    if (data.response instanceof Error)
      data.response = { error: { message: data.response.message } }
    else data.response = { data: data.response }
  }
}

/**
 * Generate a function with NextJsPlugin.
 *
 * @example
 * ```ts
 * // create a function in server
 * 'use server'
 * import { useFuncWithNextJsPlugin } from '@faasjs/nextjs'
 *
 * export const serverAction = useFuncWithNextJsPlugin<{
 *   a: number
 *   b: number
 * }>(async ({ params }) => {
 *  return { message: params.a + params.b }
 * })
 *
 * // using in client
 * 'use client'
 * import { serverAction } from './server'
 *
 * function App() {
 *   return <form action={serverAction}>
 *    <input name="a" type="number" />
 *    <input name="b" type="number" />
 *   <Button>Submit</Button>
 * </form>
 * }
 * ```
 */
export function useFuncWithNextJsPlugin<
  TParams extends Record<string, any> = any,
  TResult = any,
>(
  handler: (data: {
    params: TParams
    logger: Logger
  }) => Promise<TResult>,
  plugins?: Plugin[]
) {
  const func = new Func<TParams, null, TResult>({
    plugins: [new NextJsPlugin(), ...(plugins || [])],
    handler: handler as any,
  }).export()

  return (params?: TParams) => func.handler(params)
}
