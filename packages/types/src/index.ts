/**
 * # @faasjs/types
 *
 * Shared action and job type helpers for FaasJS backends, generated declarations,
 * React callers, and TypeScript config presets.
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
 *
 * @packageDocumentation
 */
/**
 * Augmentation interface for registering typed FaasJS actions.
 *
 * Extend this interface via declaration merging to register typed
 * action paths and their corresponding `Params` and `Data` shapes.
 * Each key is an action path (e.g. `'user/login'`) and each value
 * is an object with `Params` and `Data` type properties.
 * Generated route declarations use the same interface and map route keys to
 * `InferFaasAction<typeof import('../path.api')>`.
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
 * Augmentation interface for registering typed FaasJS jobs.
 *
 * Extend this interface via declaration merging to register `.job.ts`
 * paths and their parameter types. Generated declarations map each job path
 * to `InferFaasJob<typeof import('../path.job')>`.
 *
 * @example
 * ```ts
 * declare module '@faasjs/types' {
 *   interface FaasJobs {
 *     'features/users/jobs/sync': {
 *       Params: { userId: string }
 *     }
 *   }
 * }
 * ```
 *
 * @see {@link FaasJobPaths}
 * @see {@link FaasJobParams}
 */
export interface FaasJobs {}

/**
 * Union of all declared action path string literals.
 *
 * Used internally by {@link FaasParams} and {@link FaasData} to
 * resolve parameter and response types by action path.
 * Resolves to `never` until `FaasActions` is augmented, usually by the
 * generated `src/.faasjs/types.d.ts` file being included in `tsconfig.json`.
 *
 * @see {@link FaasParams}
 * @see {@link FaasData}
 */
export type FaasActionPaths = Extract<keyof FaasActions, string>

/**
 * Union of all declared `.job.ts` path string literals.
 *
 * Resolves to `never` until `FaasJobs` is augmented, usually by the
 * generated `src/.faasjs/types.d.ts` file.
 */
export type FaasJobPaths = Extract<keyof FaasJobs, string>

/**
 * Infer the params type for a registered job path.
 *
 * @template Path - A path registered in `FaasJobs`.
 */
export type FaasJobParams<Path extends FaasJobPaths> = FaasJobs[Path] extends {
  Params: infer TParams
}
  ? TParams
  : never

type FaasActionValue<T, TField extends 'Params' | 'Data'> = T extends FaasActionPaths
  ? FaasActions[T][TField]
  : T extends string
    ? Record<string, unknown>
    : never

/**
 * Infer the params type for a given action path.
 *
 * When `T` matches a declared {@link FaasActionPaths | action path},
 * resolves to `FaasActions[T]['Params']`. Falls back to
 * `Record<string, unknown>` for explicit unrecognized string paths.
 * Returns `never` when `T` is not a string; the bare `FaasParams` default uses
 * `unknown`, so it also resolves to `never`.
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
 * @see {@link FaasActionPaths}
 * @see {@link FaasData}
 */
export type FaasParams<T = unknown> = FaasActionValue<T, 'Params'>

/**
 * Infer the response data type for a given action path.
 *
 * When `T` matches a declared {@link FaasActionPaths | action path},
 * resolves to `FaasActions[T]['Data']`. Falls back to
 * `Record<string, unknown>` for explicit unrecognized string paths.
 * Returns `never` when `T` is not a string; the bare `FaasData` default uses
 * `unknown`, so it also resolves to `never`.
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
 * @see {@link FaasActionPaths}
 * @see {@link FaasParams}
 */
export type FaasData<T = unknown> = FaasActionValue<T, 'Data'>

type InferFaasActionParams<TEvent> =
  NonNullable<TEvent> extends { params?: infer TParams }
    ? NonNullable<TParams>
    : Record<string, unknown>

type InferFaasActionFromHandler<THandler> = THandler extends (
  event?: infer TEvent,
  ...args: any[]
) => Promise<infer TData>
  ? {
      Params: InferFaasActionParams<TEvent>
      Data: TData
    }
  : never

type InferFaasActionFromApi<TApi> = TApi extends {
  export: () => {
    handler: infer THandler
  }
}
  ? InferFaasActionFromHandler<THandler>
  : never

/**
 * Infer `{ Params, Data }` from a FaasJS API object or a module whose default
 * export is a FaasJS API object.
 *
 * Peers into the exported handler signature to extract:
 * - `Params` — resolved from the handler event's `params` field.
 * - `Data` — resolved from the handler's return type.
 *
 * Supports direct API objects and module objects with an ESM `default` export.
 * Returns `never` when inference fails.
 *
 * @template TApi - A Func, Func-like object, or module shape with a
 *   `default` export.
 * @returns An object type with `Params` and `Data` properties
 *   when inference succeeds, otherwise `never`.
 *
 * @example
 * ```ts
 * import type { InferFaasAction } from '@faasjs/types'
 * import type * as loginApi from './user/login.api'
 *
 * type LoginAction = InferFaasAction<typeof loginApi>
 * // → { Params: { email: string }; Data: { token: string } }
 * ```
 *
 * @see {@link FaasParams}
 * @see {@link FaasData}
 */
export type InferFaasAction<TApi> =
  InferFaasActionFromApi<TApi> extends never
    ? TApi extends { default: infer TDefault }
      ? InferFaasActionFromApi<TDefault>
      : never
    : InferFaasActionFromApi<TApi>

/**
 * Infer `{ Params }` from a FaasJS job definition or a module whose default
 * export is a FaasJS job definition.
 *
 * @template TJob - A `Job` object or module with a default `Job` export.
 * @returns An object containing the job params type, or `never` when inference fails.
 *
 * @example
 * ```ts
 * import type { InferFaasJob } from '@faasjs/types'
 * import type * as syncJob from './features/users/jobs/sync.job'
 *
 * type SyncJob = InferFaasJob<typeof syncJob>
 * // → { Params: { userId: string } }
 * ```
 *
 * @see {@link FaasJobParams}
 * @see {@link FaasJobPaths}
 */
export type InferFaasJob<TJob> = TJob extends { readonly __faasjsJobParams: infer TParams }
  ? { Params: TParams }
  : TJob extends { default: infer TDefault }
    ? TDefault extends { readonly __faasjsJobParams: infer TParams }
      ? { Params: TParams }
      : never
    : never
