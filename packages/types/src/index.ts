/**
 * Action Type definitions for FaasJS and cross backend and frontend.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/types.svg)](https://github.com/faasjs/faasjs/blob/main/packages/types/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/types.svg)](https://www.npmjs.com/package/@faasjs/types)
 *
 * ## Install
 *
 * Normally you don't need to install this package manually. It's a dependency of `@faasjs/core` and `@faasjs/react`.
 *
 * ## Usage
 *
 * ### TypeScript config presets
 *
 * `@faasjs/types` also provides shared TypeScript presets under `tsconfig/`:
 *
 * - `@faasjs/types/tsconfig/base`: strict base options for common TypeScript projects.
 * - `@faasjs/types/tsconfig/react`: base options with `jsx: "react-jsx"` for React projects.
 * - `@faasjs/types/tsconfig/build`: build-oriented options for package development.
 *
 * In your tsconfig.json:
 *
 * ```json
 * {
 *   "extends": "@faasjs/types/tsconfig/build"
 * }
 * ```
 *
 * @packageDocumentation
 */
type FaasFuncLike = {
  export: () => {
    handler: (...args: any[]) => any
  }
}

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
export interface FaasActions {
  /**
   * Internal placeholder to keep this interface visible in generated docs.
   */
  faasjsActionsPlaceholder?: {
    Params: Record<string, any>
    Data: Record<string, any>
  }
}

/**
 * Interface for defining inferred event types by action path.
 *
 * @example
 * ```typescript
 * declare module '@faasjs/types' {
 *   interface FaasEvents {
 *     demo: {
 *       params?: {
 *         key: string
 *       }
 *     }
 *   }
 * }
 * ```
 */
export interface FaasEvents {
  /**
   * Internal placeholder to keep this interface visible in generated docs.
   */
  faasjsEventsPlaceholder?: Record<string, any>
}

/**
 * Infer all action paths declared in {@link FaasActions}.
 */
export type FaasActionPaths = Exclude<
  Extract<keyof FaasActions, string>,
  'faasjsActionsPlaceholder'
>

/**
 * Infer all event paths declared in {@link FaasEvents}.
 */
export type FaasEventPaths = Exclude<Extract<keyof FaasEvents, string>, 'faasjsEventsPlaceholder'>

/**
 * Union type accepted by action helpers.
 */
export type FaasActionUnionType =
  // Action paths defined in FaasActions
  | FaasActionPaths
  // Returning data type
  | Record<string, any>
  // action path as string
  | string

/**
 * Infer the action path type.
 *
 * Returns the original type when `T` is a known action path,
 * otherwise falls back to `string`.
 *
 * @example
 * ```typescript
 * type A = FaasAction<'demo'> // 'demo'
 * type B = FaasAction<number> // string
 * ```
 */
export type FaasAction<T = any> = T extends FaasActionPaths ? T : string

/**
 * Infer params type by action path.
 *
 * @example
 * ```typescript
 * type DemoParams = FaasParams<'demo'>
 * ```
 */
export type FaasParams<T = any> = T extends FaasActionPaths
  ? FaasActions[T]['Params']
  : Record<string, any>

/**
 * Infer response data type by action path.
 *
 * If `T` is already a plain object type, it is returned directly.
 *
 * @example
 * ```typescript
 * type DemoData = FaasData<'demo'>
 * type CustomData = FaasData<{ value: number }> // { value: number }
 * ```
 */
export type FaasData<T = any> = T extends FaasActionPaths
  ? FaasActions[T]['Data']
  : T extends Record<string, any>
    ? T
    : Record<string, any>

/**
 * Infer event payload type by event path.
 *
 * @example
 * ```typescript
 * type DemoEvent = FaasEvent<'demo'>
 * ```
 */
export type FaasEvent<T = any> = T extends FaasEventPaths ? FaasEvents[T] : Record<string, any>

/**
 * Infer the FaasAction type from a Func.
 *
 * @example
 * ```typescript
 * import { defineApi, z } from '@faasjs/core'
 * import type { InferFaasAction } from '@faasjs/types'
 *
 * const schema = z
 *   .object({
 *     number: z.number(),
 *   })
 *   .required()
 *
 * export const func = defineApi({
 *   schema,
 *   async handler({ params }) {
 *     if (!params) throw Error('params is required')
 *
 *     return params.number + 1
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
export type InferFaasAction<TFunc extends FaasFuncLike> = {
  Params: NonNullable<Parameters<ReturnType<TFunc['export']>['handler']>[0]>['params']
  Data: Awaited<ReturnType<ReturnType<TFunc['export']>['handler']>>
}

/**
 * Infer the Func type from a module.
 *
 * Supports both `export const func = defineApi(...)` and `export default defineApi(...)`.
 *
 * @example
 * ```typescript
 * import type { InferFaasAction, InferFaasFunc } from '@faasjs/types'
 *
 * declare module '@faasjs/types' {
 *   interface FaasActions {
 *     demo: InferFaasAction<
 *       InferFaasFunc<typeof import('./functions/demo')>
 *     >
 *   }
 * }
 * ```
 */
export type InferFaasFunc<TModule> = TModule extends { func: infer TFunc }
  ? TFunc extends FaasFuncLike
    ? TFunc
    : never
  : TModule extends { default: infer TFunc }
    ? TFunc extends FaasFuncLike
      ? TFunc
      : never
    : never
