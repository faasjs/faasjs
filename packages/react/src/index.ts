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
 * - Compatible with [why-did-you-render](https://github.com/welldone-software/why-did-you-render).
 * - Additional React functions:
 *   - Utils:
 *     - `equal`: Compare two values for deep equality.
 *     - `createSplittingContext`: Create a context for code splitting.
 *     - `useSplittingState`: Create splitting states.
 *   - Hooks:
 *     - `useEqualMemoize`: Memoize a value with deep equality.
 *     - `useEqualEffect`: Run an effect with deep equality.
 *     - `useEqualMemo`: Memoize a value with deep equality.
 *     - `useEqualCallback`: Memoize a callback with deep equality.
 *     - `useConstant`: Create a constant value with hooks.
 *     - `usePrevious`: Get the previous value of a state.
 *     - `useStateRef`: Create a state with a ref.
 *   - Components:
 *     - `OptionalWrapper`: Render a component optionally.
 *     - `ErrorBoundary`: Catch errors in the component tree.
 *   - Fetch Data:
 *     - `faas`: Fetch data from FaasJS.
 *     - `useFaas`: Fetch data from FaasJS with hooks.
 *     - `useFaasStream`: Fetch streaming data from FaasJS with hooks.
 *     - `FaasDataWrapper`: Fetch data from FaasJS with a wrapper component.
 *     - `withFaasData`: Fetch data from FaasJS using a higher-order component (HOC).
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
  FaasActionUnionType,
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
export * from './useFaasStream'
export * from './usePrevious'
export * from './useStateRef'
