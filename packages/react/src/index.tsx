/**
 * React plugin for FaasJS.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/react.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/react/LICENSE)
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
 *     - [useConstant](functions/useConstant.md): Create a constant value with hooks.
 *     - [createSplittingContext](functions/createSplittingContext.md): Create a context for code splitting.
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
 * npm install @faasjs/react
 * ```
 *
 * @packageDocumentation
 */

export type {
  FaasAction,
  FaasData,
  FaasParams,
} from '@faasjs/types'

export type {
  Options,
  Response,
  ResponseHeaders,
  ResponseError,
} from '@faasjs/browser'

export { useConstant } from './constant'
export { createSplittingContext } from './splittingContext'

export * from './client'
export * from './faas'
export * from './ErrorBoundary'
export * from './FaasDataWrapper'
export * from './OptionalWrapper'
export * from './useFaas'
