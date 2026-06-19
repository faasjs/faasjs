import {
  Func,
  Http,
  type FuncConfig,
  type Handler,
  type HttpConfig,
  type InvokeData,
  type Response,
} from '@faasjs/core'
import { streamToString } from '@faasjs/utils'
import { expect } from 'vitest'

type TestHandler<TEvent, TContext, TResult> = (
  data: InvokeData<TEvent, TContext, TResult>,
) => Promise<TResult> | TResult

type TestHttpFuncOptions<TEvent, TContext, TResult> = {
  config?: Record<string, any>
  func?: Omit<FuncConfig<TEvent, TContext, TResult>, 'handler' | 'plugins'>
  http?: HttpConfig
}

export function createHttp(config: HttpConfig = {}) {
  const cookie = config.config?.cookie

  return new Http({
    ...config,
    config: {
      ...config.config,
      cookie: {
        ...cookie,
        session: {
          secret: 'test-secret',
          ...cookie?.session,
        },
      },
    },
  })
}

export function createHttpFunc<TEvent = any, TContext = any, TResult = any>(
  handler: TestHandler<TEvent, TContext, TResult>,
  options: TestHttpFuncOptions<TEvent, TContext, TResult> = {},
): Func<any, any, any> {
  const func = new Func<TEvent, TContext, TResult>({
    ...options.func,
    plugins: [createHttp(options.http)],
    handler: handler as Handler<TEvent, TContext, TResult>,
  })

  if (options.config) func.config = options.config

  return func as Func<any, any, any>
}

export function createHttpHandler<TEvent = any, TContext = any, TResult = any>(
  handler: TestHandler<TEvent, TContext, TResult>,
  options?: TestHttpFuncOptions<TEvent, TContext, TResult>,
) {
  return createHttpFunc(handler, options).export().handler as (...args: any[]) => Promise<any>
}

export async function expectBody(response: Response, body: string) {
  expect(response.body).toBeInstanceOf(ReadableStream)
  expect(await streamToString(response.body as ReadableStream)).toEqual(body)
}

export function createStream(chunk: string) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(chunk)
      controller.close()
    },
  })
}
