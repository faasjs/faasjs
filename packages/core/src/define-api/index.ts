import { parseSchemaValue, type SchemaOutput } from '@faasjs/node-utils'
import type { ZodType } from '@faasjs/utils'

import type { Handler, InvokeData } from '../func'
import { Func } from '../func'
import { HttpError, type Cookie, type Session } from '../plugins/http'

type IsAny<T> = 0 extends 1 & T ? true : false
type DefineApiEventParams<TSchema extends ZodType | undefined = undefined> = SchemaOutput<
  TSchema,
  Record<string, unknown>
>
type DefineApiEvent<
  TSchema extends ZodType | undefined = undefined,
  TEvent = Record<string, unknown>,
> =
  IsAny<TEvent> extends true
    ? Record<string, unknown> & {
        params?: DefineApiEventParams<TSchema>
      }
    : TEvent

/**
 * Handler data passed to {@link defineApi}.
 *
 * Extends the normal invoke data with validated `params`, `cookie`, `session`,
 * and any plugin-provided fields declared through `DefineApiInject`.
 *
 * @template TSchema - Zod schema used to validate `event.params`.
 * @template TEvent - Raw event type passed to the function.
 * @template TContext - Runtime context type.
 * @template TResult - Handler return type.
 */
export type DefineApiData<
  TSchema extends ZodType | undefined = undefined,
  TEvent = Record<string, unknown>,
  TContext = unknown,
  TResult = unknown,
> = InvokeData<TEvent, TContext, TResult> & {
  /**
   * Params validated by the optional Zod schema.
   */
  params: SchemaOutput<TSchema, Record<string, never>>
  /**
   * Cookie helper injected by the HTTP plugin.
   */
  cookie: Cookie
  /**
   * Session helper injected by the HTTP plugin.
   */
  session: Session
} & DefineApiInject

/**
 * API data augmentation map.
 *
 * Extend this interface in plugin packages to describe which data fields are
 * injected into `defineApi` handler arguments.
 */
export interface DefineApiInject extends Record<never, never> {}

/**
 * Options for creating a typed API function with {@link defineApi}.
 *
 * @template TSchema - Zod schema used to validate `event.params`.
 * @template TEvent - Raw event type passed to the function.
 * @template TContext - Runtime context type.
 * @template TResult - Handler return type.
 */
export type DefineApiOptions<
  TSchema extends ZodType | undefined = undefined,
  TEvent = Record<string, unknown>,
  TContext = unknown,
  TResult = unknown,
> = {
  /**
   * Optional Zod schema used to validate `event.params`.
   */
  schema?: TSchema
  /**
   * Async business handler executed after plugin and schema setup.
   */
  handler: (data: DefineApiData<TSchema, TEvent, TContext, TResult>) => Promise<TResult>
}

/**
 * Create an HTTP API function with optional Zod validation.
 *
 * The `http` plugin must come from `faas.yaml` or explicit code injection.
 *
 * @template TSchema - Zod schema used to validate `event.params`.
 * @template TEvent - Raw event type passed to the function.
 * @template TContext - Runtime context type.
 * @template THandler - Handler signature used to infer the response type.
 * @param {DefineApiOptions<TSchema, TEvent, TContext, Awaited<ReturnType<THandler>>>} options - Schema and handler used to build the API function.
 * @param {TSchema} [options.schema] - Optional Zod schema used to validate `event.params`.
 * @param {THandler} options.handler - Async business handler executed after plugins and validation are ready.
 * @throws {Error} When the required `http` plugin is missing from `faas.yaml` and no plugin was injected in code.
 * @throws {HttpError} When `event.params` fails schema validation.
 *
 * @example
 * ```ts
 * import { defineApi } from '@faasjs/core'
 * import { z } from '@faasjs/utils'
 *
 * const schema = z.object({
 *   name: z.string().min(1),
 * })
 *
 * export default defineApi({
 *   schema,
 *   async handler({ params }) {
 *     return {
 *       message: `Hello, ${params.name}`,
 *     }
 *   },
 * })
 * ```
 */
export function defineApi<
  TSchema extends ZodType | undefined = undefined,
  TEvent = Record<string, unknown>,
  TContext = unknown,
  THandler extends (data: DefineApiData<TSchema, TEvent, TContext, any>) => Promise<any> = (
    data: DefineApiData<TSchema, TEvent, TContext, any>,
  ) => Promise<any>,
>(
  options: Omit<
    DefineApiOptions<TSchema, TEvent, TContext, Awaited<ReturnType<THandler>>>,
    'handler'
  > & {
    handler: THandler
  },
): Func<DefineApiEvent<TSchema, TEvent>, TContext, Awaited<ReturnType<THandler>>> {
  type Event = DefineApiEvent<TSchema, TEvent>
  type Result = Awaited<ReturnType<THandler>>

  let api: Func<Event, TContext, Result>
  type Params = DefineApiData<TSchema, TEvent, TContext, Result>['params']

  const invokeHandler: Handler<Event, TContext, Result> = async (data) => {
    if (!api.plugins.some((plugin) => plugin.type === 'http'))
      throw Error(
        '[defineApi] Missing required "http" plugin. Please configure it in faas.yaml or inject it in code.',
      )

    const params = (await parseSchemaValue<TSchema>({
      schema: options.schema,
      value: (data.event as Record<string, unknown>)?.params,
      errorMessage: 'Invalid params',
      createError: (message) =>
        new HttpError({
          statusCode: 400,
          message,
        }),
    })) as Params

    const invokeData = {
      ...data,
      params,
    } as DefineApiData<TSchema, TEvent, TContext, Result>

    return options.handler(invokeData)
  }

  api = new Func<Event, TContext, Result>({
    plugins: [],
    handler: invokeHandler,
  })

  return api
}
