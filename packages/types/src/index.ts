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
 * `@faasjs/types` also provides shared TypeScript presets under `tsconfig/`.
 * Both extensionless and `.json` subpaths are exported, so use whichever form
 * your tooling prefers:
 *
 * - `@faasjs/types/tsconfig/base` or `@faasjs/types/tsconfig/base.json`: strict base options for common TypeScript projects.
 * - `@faasjs/types/tsconfig/react` or `@faasjs/types/tsconfig/react.json`: base options with `jsx: "react-jsx"` for React projects.
 * - `@faasjs/types/tsconfig/build` or `@faasjs/types/tsconfig/build.json`: build-oriented options for Vite apps, packages, and workspace modules.
 *
 * In your tsconfig.json:
 *
 * ```json
 * {
 *   "extends": "@faasjs/types/tsconfig/build.json"
 * }
 * ```
 */
type FaasFuncLike = {
  export: () => {
    handler: (...args: any[]) => any
  }
}

/**
 * Interface for defining FaasJS actions.
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
 * Infer all action paths declared in {@link FaasActions}.
 */
export type FaasActionPaths = Exclude<
  Extract<keyof FaasActions, string>,
  'faasjsActionsPlaceholder'
>

/**
 * Union type accepted by action helpers when callers pass either an action path or inferred data shape.
 */
export type FaasActionUnionType = Record<string, any> | string

/**
 * Infer the action path type.
 *
 * Returns the original type when `T` is a known action path,
 * otherwise falls back to `string`.
 *
 * @template T - Candidate action path type.
 */
export type FaasAction<T = any> = T extends FaasActionPaths ? T : string

/**
 * Infer params type by action path.
 *
 * @template T - Candidate action path type.
 */
export type FaasParams<T = any> = T extends FaasActionPaths
  ? FaasActions[T]['Params']
  : Record<string, any>

/**
 * Infer response data type by action path.
 *
 * If `T` is already a plain object type, it is returned directly.
 *
 * @template T - Candidate action path or response data type.
 */
export type FaasData<T = any> = T extends FaasActionPaths
  ? FaasActions[T]['Data']
  : T extends Record<string, any>
    ? T
    : Record<string, any>

/**
 * Infer the FaasAction type from a Func.
 *
 * @template TFunc - Func-like export used to infer params and data.
 */
export type InferFaasAction<TFunc extends FaasFuncLike> = TFunc extends {
  export: () => {
    handler: (event?: infer TEvent, ...args: any[]) => Promise<infer TData>
  }
}
  ? {
      Params: NonNullable<TEvent> extends { params?: infer TParams }
        ? NonNullable<TParams>
        : Record<string, any>
      Data: TData
    }
  : never

/**
 * Infer the API type from a module.
 *
 * Supports `export default defineApi(...)` first and falls back to the legacy
 * `func` export shape during migration.
 *
 * @template TModule - Module shape that may expose a FaasJS API.
 */
export type InferFaasApi<TModule> = TModule extends { default: infer TFunc }
  ? TFunc extends FaasFuncLike
    ? TFunc
    : never
  : TModule extends { func: infer TFunc }
    ? TFunc extends FaasFuncLike
      ? TFunc
      : never
    : never
