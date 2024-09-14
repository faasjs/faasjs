import { type Plugin, type InvokeData, type Next, Func } from '@faasjs/func'

export class NextJsPlugin implements Plugin {
  readonly type = 'NextJs'
  readonly name = 'NextJs'

  async onInvoke(data: InvokeData, next: Next) {
    if (data.event instanceof FormData) {
      data.logger.warn('[NextJsPlugin] FormData is not recommended.')

      data.params = {}
      for (const [key, value] of data.event.entries()) {
        data.params[key] = value
      }
    } else {
      data.params = data.event
    }

    data.logger.debug('[NextJsPlugin] Params: %j', data.params)

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
 * import { useFuncWithNextJsPlugin } from '@faasjs/nextjs/server'
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
 *   return <Form action={serverAction}>
 *    <Input name="a" type="number" />
 *    <Input name="b" type="number" />
 *   <Button>Submit</Button>
 * </Form>
 * }
 * ```
 */
export function useFuncWithNextJsPlugin<
  TParams extends Record<string, any> = any,
  TResult = any,
>(
  handler: (data: {
    params: TParams
  }) => Promise<TResult>,
  plugins?: Plugin[]
) {
  const func = new Func({
    plugins: [new NextJsPlugin(), ...(plugins || [])],
    handler: handler as any,
  }).export()

  return (params?: TParams) => func.handler(params)
}
