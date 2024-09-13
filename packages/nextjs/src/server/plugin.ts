import {
  type Plugin,
  type InvokeData,
  type Next,
  Func,
  type Handler,
} from '@faasjs/func'

export class NextJsPlugin implements Plugin {
  readonly type = 'NextJs'
  readonly name = 'NextJs'

  async onInvoke(data: InvokeData, next: Next) {
    await next()

    if (data.response instanceof Error)
      data.response = { error: { message: data.response.message } }
    else data.response = { data: data.response }
  }
}

export function useFuncWithNextJsPlugin(
  handler: Handler<any, any, any>,
  plugins?: Plugin[]
) {
  const func = new Func({
    plugins: [new NextJsPlugin(), ...(plugins || [])],
    handler,
  }).export()

  return func.handler
}
