/**
 * React plugin for FaasJS.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/react.svg)](https://github.com/faasjs/faasjs/blob/main/packages/react/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/react.svg)](https://www.npmjs.com/package/@faasjs/react)
 *
 * **If you use [SWR](https://swr.vercel.app) or [React Query / TanStack Query](https://tanstack.com/query), please use [`@faasjs/browser`](https://faasjs.com/doc/browser) directly.**
 *
 * ## Features
 *
 * - Support [FaasJS Request Specifications](https://faasjs.com/guide/request-spec.html).
 * - Support global and per-request configurations.
 * - Support [React Server Actions](https://react.dev/reference/rsc/server-actions).
 * - Compatible with [why-did-you-render](https://github.com/welldone-software/why-did-you-render).
 * - Additional React functions:
 *   - Utils:
 *     - [equal](functions/equal.md): Compare two values for deep equality.
 *     - [createSplittingContext](functions/createSplittingContext.md): Create a context for code splitting.
 *     - [splittingState](functions/splittingState.md): Create a splitting states.
 *   - Hooks:
 *     - [useEqualMemoize](functions/useEqualMemoize.md): Memoize a value with deep equality.
 *     - [useEqualEffect](functions/useEqualEffect.md): Run an effect with deep equality.
 *     - [useEqualMemo](functions/useEqualMemo.md): Memoize a value with deep equality.
 *     - [useEqualCallback](functions/useEqualCallback.md): Memoize a callback with deep equality.
 *     - [useConstant](functions/useConstant.md): Create a constant value with hooks.
 *     - [usePrevious](functions/usePrevious.md): Get the previous value of a state.
 *     - [useStateRef](functions/useStateRef.md): Create a state with a ref.
 *   - Components:
 *     - [OptionalWrapper](functions/OptionalWrapper.md): Render a component optionally.
 *     - [ErrorBoundary](classes/ErrorBoundary.md): Catch errors in the component tree.
 *   - Fetch Data:
 *     - [faas](functions/faas.md): Fetch data from FaasJS.
 *     - [useFaas](functions/useFaas.md): Fetch data from FaasJS with hooks.
 *     - [FaasDataWrapper](functions/FaasDataWrapper.md): Fetch data from FaasJS with a wrapper component.
 *     - [withFaasData](functions/withFaasData.md): Fetch data from FaasJS using a higher-order component (HOC).
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/react react
 * ```
 *
 * @packageDocumentation
 */

export type {
  Options,
  Response,
  ResponseError,
  ResponseHeaders,
} from '@faasjs/browser'
export type {
  FaasAction,
  FaasData,
  FaasParams,
} from '@faasjs/types'
export * from './client'
export * from './constant'
export * from './ErrorBoundary'
export * from './equal'
export * from './FaasDataWrapper'
export * from './Form'
export * from './faas'
export * from './OptionalWrapper'
export * from './splittingContext'
export * from './splittingState'
export * from './useFaas'
export * from './usePrevious'
export * from './useStateRef'
