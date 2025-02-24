/**
 * Action Type definitions for FaasJS and cross backend and frontend.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/types.svg)](https://github.com/faasjs/faasjs/blob/main/packages/types/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/types.svg)](https://www.npmjs.com/package/@faasjs/types)
 *
 * ## Install
 *
 * Normally you don't need to install this package manually. It's a dependency of `@faasjs/func` and `@faasjs/browser`.
 *
 * ## Usage
 *
 * @see {@link InferFaasAction}
 *
 * @packageDocumentation
 */
import type { Func } from '@faasjs/func'
/**
 * The type of the actions.
 *
 * @see https://faasjs.com/doc/types/
 */

/**
 * Interface for defining FaasJS actions.
 *
 * @example
 * ```typescript
 * declare module '@faasjs/types' {
 *   interface FaasActions {
 *     demo: {
 *       Params: {
 *         key: string
 *       }
 *       Data: {
 *         value: string
 *       }
 *     }
 *   }
 * }
 * ```
 */
// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface FaasActions {}

/**
 * Paths of FaasJS actions.
 */
export type FaasActionPaths = keyof FaasActions

export type ReactServerAction = (...args: any[]) => Promise<any>

/**
 * Union type of all action types.
 */
export type FaasActionUnionType =
  // Action paths defined in FaasActions
  | FaasActionPaths
  // React server action
  | ReactServerAction
  // Returning data type
  | Record<string, any>
  // action path as string
  | string

/**
 * Infer the action type.
 */
export type FaasAction<T = any> = T extends ReactServerAction
  ? T
  : T extends FaasActionPaths
    ? T
    : string

/**
 * Infer the parameters type.
 */
export type FaasParams<T = any> = T extends FaasActionPaths
  ? FaasActions[T]['Params']
  : T extends ReactServerAction
    ? Parameters<T>[0]
    : Record<string, any>

/**
 * Infer the returning data type.
 */
export type FaasData<T = any> = T extends FaasActionPaths
  ? FaasActions[T]['Data']
  : T extends ReactServerAction
    ? Awaited<ReturnType<T>>
    : T extends Record<string, any>
      ? T
      : Record<string, any>

/**
 * Infer the FaasAction type from a Func.
 *
 * @example
 * ```typescript
 * import { useFunc } from '@faasjs/func'
 * import { useHttp } from '@faasjs/http'
 * import type { InferFaasAction } from '@faasjs/types'
 *
 * export const func = useFunc<
 *   {
 *     params: { // define the params type
 *       number: number
 *     }
 *   },
 *   unknown, // context type, can be skipped
 *   number // define the return type
 * >(() => {
 *   useHttp()
 *
 *   return ({ event}) => {
 *     return event.params.number + 1
 *   }
 * })
 *
 * // declare the action type to FaasActions
 * declare module '@faasjs/types' {
 *   interface FaasActions {
 *     // if 'demo' is the action path
 *     'demo': InferFaasAction<typeof func>
 *   }
 * }
 * ```
 */
export type InferFaasAction<TFunc extends Func> = {
  Params: Parameters<ReturnType<TFunc['export']>['handler']>[0]['params']
  Data: Awaited<ReturnType<ReturnType<TFunc['export']>['handler']>>
}
