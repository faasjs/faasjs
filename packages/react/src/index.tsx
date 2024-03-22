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
 * - Capiable with [why-did-you-render](https://github.com/welldone-software/why-did-you-render).
 * - Additional functions for React.
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/react
 * ```
 *
 * ## Usage
 *
 * 1. Initialize [FaasReactClient](#faasreactclient)
 *
 * ```ts
 * import { FaasReactClient } from '@faasjs/react'
 *
 * const client = FaasReactClient({
 *   domain: 'localhost:8080/api'
 * })
 * ```
 *
 * 2. Use [faas](#faas), [useFaas](#usefaas) or [FaasDataWrapper](#faasdatawrapper).
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
export { createSplitedContext } from './splitedContext'

export * from './client'
export * from './ErrorBoundary'

export type {
  FaasReactClientInstance,
  FaasDataInjection,
  FaasDataWrapperProps,
  useFaasOptions,
} from './types'
