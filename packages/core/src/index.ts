/**
 * FaasJS core package.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/core.svg)](https://github.com/faasjs/faasjs/blob/main/packages/core/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/core.svg)](https://www.npmjs.com/package/@faasjs/core)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/core
 * ```
 */

import type { output, ZodError, ZodType } from 'zod'

import type { Handler, InvokeData } from './func'
import { Func } from './func'
import { HttpError, type Cookie, type Session } from './plugins/http'

export * from './func'
export * from './plugins/http'
export * from './middleware'
export * from './server'
export * from './utils'

type IsAny<T> = 0 extends 1 & T ? true : false
type DefineApiEventParams<TSchema extends ZodType | undefined = undefined> = TSchema extends ZodType
  ? output<NonNullable<TSchema>>
  : Record<string, any>
type DefineApiEvent<TSchema extends ZodType | undefined = undefined, TEvent = any> =
  IsAny<TEvent> extends true
    ? Record<string, any> & {
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
  TEvent = any,
  TContext = any,
  TResult = any,
> = InvokeData<TEvent, TContext, TResult> & {
  /**
   * Params validated by the optional Zod schema.
   */
  params: TSchema extends ZodType ? output<NonNullable<TSchema>> : Record<string, never>
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
  TEvent = any,
  TContext = any,
  TResult = any,
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

function normalizeIssueMessage(message: string): string {
  return message.replace(': expected', ', expected').replace(/>=\s+/g, '>=').replace(/<=\s+/g, '<=')
}

function formatZodErrorMessage(error: ZodError): string {
  const lines = ['Invalid params']

  for (const issue of error.issues) {
    const path = issue.path.length ? issue.path.map((item) => String(item)).join('.') : '<root>'

    lines.push(`${path}: ${normalizeIssueMessage(issue.message)}`)
  }

  return lines.join('\n')
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
 * import * as z from 'zod'
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
  TEvent = any,
  TContext = any,
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

  let func: Func<Event, TContext, Result>
  type Params = DefineApiData<TSchema, TEvent, TContext, Result>['params']

  const parseParams = async (event: Event): Promise<Params> => {
    if (!func.plugins.some((plugin) => plugin.type === 'http'))
      throw Error(
        '[defineApi] Missing required "http" plugin. Please configure it in faas.yaml or inject it in code.',
      )

    if (!options.schema) return {} as Params

    const result = await options.schema.safeParseAsync((event as any)?.params ?? {})

    if (!result.success)
      throw new HttpError({
        statusCode: 400,
        message: formatZodErrorMessage(result.error),
      })

    return result.data as Params
  }

  const invokeHandler: Handler<Event, TContext, Result> = async (data) => {
    const params = await parseParams(data.event)

    const invokeData = {
      ...data,
      params,
    } as DefineApiData<TSchema, TEvent, TContext, Result>

    return options.handler(invokeData)
  }

  func = new Func<Event, TContext, Result>({
    plugins: [],
    handler: invokeHandler,
  })

  return func
}
