/**
 * # @faasjs/types
 *
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
 * - `@faasjs/types/tsconfig/base.json`: strict base options for common TypeScript projects.
 * - `@faasjs/types/tsconfig/react.json`: base options with `jsx: "react-jsx"` for React projects.
 * - `@faasjs/types/tsconfig/build.json`: build-oriented options for Vite apps, packages, and workspace modules.
 *
 * In your tsconfig.json:
 *
 * ```json
 * {
 *   "extends": "@faasjs/types/tsconfig/build.json"
 * }
 * ```
 */
/**
 * Augmentation interface for registering typed FaasJS actions.
 *
 * Extend this interface via declaration merging to register typed
 * action paths and their corresponding `Params` and `Data` shapes.
 * Each key is an action path (e.g. `'user/login'`) and each value
 * is an object with `Params` and `Data` type properties.
 *
 * @example
 * ```ts
 * declare module '@faasjs/types' {
 *   interface FaasActions {
 *     'user/login': {
 *       Params: { email: string; password: string }
 *       Data: { token: string }
 *     }
 *     'user/profile': {
 *       Params: { userId: string }
 *       Data: { name: string; email: string }
 *     }
 *   }
 * }
 *
 * // FaasParams<'user/login'> → { email: string; password: string }
 * // FaasData<'user/login'> → { token: string }
 * ```
 *
 * @see {@link FaasParams}
 * @see {@link FaasData}
 * @see {@link FaasActionPaths}
 */
export interface FaasActions {}

/**
 * Union of all declared action path string literals.
 *
 * Used internally by {@link FaasParams} and {@link FaasData} to
 * resolve parameter and response types by action path.
 *
 * @see {@link FaasActions}
 * @see {@link FaasParams}
 * @see {@link FaasData}
 */
export type FaasActionPaths = Extract<keyof FaasActions, string>

/**
 * Infer the params type for a given action path.
 *
 * When `T` matches a declared {@link FaasActionPaths | action path},
 * resolves to `FaasActions[T]['Params']`. Falls back to
 * `Record<string, unknown>` for unrecognized string paths.
 * Returns `never` when `T` is not a string.
 *
 * @template T - Candidate action path or params type.
 * @returns `FaasActions[T]['Params']` when `T` is a registered action
 *   path, `Record<string, unknown>` for any unregistered string,
 *   or `never` when `T` is not a string.
 *
 * @example
 * ```ts
 * // Registered action — resolves to the declared Params type
 * type LoginParams = FaasParams<'user/login'>
 * // → { email: string; password: string }
 *
 * // Unregistered string — falls back to a generic record
 * type UnknownParams = FaasParams<'some/action'>
 * // → Record<string, unknown>
 *
 * // Non-string — resolves to never
 * type Invalid = FaasParams<42>
 * // → never
 * ```
 *
 * @see {@link FaasActions}
 * @see {@link FaasActionPaths}
 * @see {@link FaasData}
 */
export type FaasParams<T = unknown> = T extends FaasActionPaths
  ? FaasActions[T]['Params']
  : T extends string
    ? Record<string, unknown>
    : never

/**
 * Infer the response data type for a given action path.
 *
 * When `T` matches a declared {@link FaasActionPaths | action path},
 * resolves to `FaasActions[T]['Data']`. Falls back to
 * `Record<string, unknown>` for unrecognized string paths.
 * Returns `never` when `T` is not a string.
 *
 * @template T - Candidate action path or response data type.
 * @returns `FaasActions[T]['Data']` when `T` is a registered action
 *   path, `Record<string, unknown>` for any unregistered string,
 *   or `never` when `T` is not a string.
 *
 * @example
 * ```ts
 * // Registered action — resolves to the declared Data type
 * type LoginData = FaasData<'user/login'>
 * // → { token: string }
 *
 * // Unregistered string — falls back to a generic record
 * type UnknownData = FaasData<'some/action'>
 * // → Record<string, unknown>
 *
 * // Non-string — resolves to never
 * type Invalid = FaasData<42>
 * // → never
 * ```
 *
 * @see {@link FaasActions}
 * @see {@link FaasActionPaths}
 * @see {@link FaasParams}
 */
export type FaasData<T = unknown> = T extends FaasActionPaths
  ? FaasActions[T]['Data']
  : T extends string
    ? Record<string, unknown>
    : never

/**
 * Infer `{ Params, Data }` from a Func, Func-like object, or a
 * module whose default export is a Func.
 *
 * Peers into the handler signature of an API definition to extract:
 * - `Params` — resolved from the {@link https://faasjs.com/doc/func | event}
 *   argument of the handler via `event.params`.
 * - `Data` — resolved from the handler's return type.
 *
 * Supports both direct Func exports and default-export patterns
 * (ESM `default` / CJS `module.exports`). Returns `never` when
 * inference fails.
 *
 * @template TApi - A Func, Func-like object, or module shape with a
 *   `default` export.
 * @returns An object type with `Params` and `Data` properties
 *   when inference succeeds, otherwise `never`.
 *
 * @example
 * ```ts
 * import type { InferFaasAction } from '@faasjs/types'
 * import type * as loginApi from './user/login.func'
 *
 * type LoginAction = InferFaasAction<typeof loginApi>
 * // → { Params: { email: string }; Data: { token: string } }
 * ```
 *
 * @see {@link FaasParams}
 * @see {@link FaasData}
 */
export type InferFaasAction<TApi> = TApi extends {
  export: () => {
    handler: (event?: infer TEvent, ...args: any[]) => Promise<infer TData>
  }
}
  ? {
      Params: NonNullable<TEvent> extends { params?: infer TParams }
        ? NonNullable<TParams>
        : Record<string, unknown>
      Data: TData
    }
  : TApi extends { default: infer TDefault }
    ? TDefault extends {
        export: () => {
          handler: (event?: infer TEvent, ...args: any[]) => Promise<infer TData>
        }
      }
      ? {
          Params: NonNullable<TEvent> extends { params?: infer TParams }
            ? NonNullable<TParams>
            : Record<string, unknown>
          Data: TData
        }
      : never
    : never
