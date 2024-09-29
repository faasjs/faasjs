/**
 * Type definitions.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/types.svg)](https://github.com/faasjs/faasjs/blob/main/packages/types/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/types.svg)](https://www.npmjs.com/package/@faasjs/types)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/types
 * ```
 *
 * @packageDocumentation
 */
// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface FaasActions { }

export type FaasActionPaths = keyof FaasActions

type ReactServerAction = (...args: any) => Promise<any>

export type FaasAction =
  | FaasActionPaths
  | Record<string, any>
  | ReactServerAction
export type FaasParams<T = any> = T extends FaasActionPaths
  ? FaasActions[T]['Params']
  : T extends ReactServerAction
  ? Parameters<T>[0]
  : T
export type FaasData<T = any> = T extends FaasActionPaths
  ? FaasActions[T]['Data']
  : T extends ReactServerAction
  ? Awaited<ReturnType<T>>
  : T
