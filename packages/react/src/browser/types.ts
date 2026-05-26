import type { FaasActionPaths, FaasData, FaasParams } from '@faasjs/types'

import type { Response } from './response'

/**
 * Template literal type for URL strings that must end with a forward slash.
 */
export type BaseUrl = `${string}/`

/**
 * Configuration options for FaasJS requests.
 *
 * Extends the standard RequestInit interface with FaasJS-specific options for
 * customizing request behavior, adding request hooks, and overriding defaults.
 */
export type Options = RequestInit & {
  headers?: Record<string, string>
  /** Async hook called after request options are merged but before the request is sent. */
  beforeRequest?: ({
    action,
    params,
    options,
    headers,
  }: {
    action: string
    params?: Record<string, any> | undefined
    options: Options
    headers: Record<string, string>
  }) => Promise<void>
  /** Custom request implementation used instead of the native `fetch`. */
  request?: (url: string, options: Options) => Promise<Response>
  /** Base URL override for the current request. */
  baseUrl?: BaseUrl
  /** When `true`, return the native fetch response so callers can consume the stream manually. */
  stream?: boolean
}

/**
 * Simple key-value object for HTTP response headers.
 */
export type ResponseHeaders = {
  [key: string]: string
}

/**
 * Type signature for the {@link FaasBrowserClient.action} method.
 *
 * @template Path - Action path used to infer the request params and response data types.
 * @param {Path} action - Action path to invoke.
 * @param {FaasParams<Path>} [params] - Params sent to the action.
 * @param {Options} [options] - Per-request overrides on top of client defaults.
 * @returns {Promise<Response<FaasData<Path>> | Response>} FaasJS response or native fetch response when streaming.
 */
export type FaasBrowserClientAction = <Path extends FaasActionPaths>(
  action: Path,
  params?: FaasParams<Path>,
  options?: Options,
) => Promise<Response<FaasData<Path>> | Response>

/**
 * Properties for creating a Response object.
 */
export type ResponseProps<T = any> = {
  status?: number
  headers?: ResponseHeaders
  body?: any
  data?: T
}

/**
 * Input accepted by the {@link ResponseError} constructor.
 */
export type ResponseErrorProps = {
  /** User-facing error message. */
  message: string
  /** HTTP status code reported for the error. @default 500 */
  status?: number
  /** Response headers returned with the error. @default {} */
  headers?: ResponseHeaders
  /** Raw error body or structured error payload. @default { error: { message } } */
  body?: any
  /** Original error preserved when this instance wraps another exception. */
  originalError?: Error
}

/**
 * Mock handler function type for testing FaasJS requests.
 */
export type MockHandler = (
  action: string,
  params: Record<string, any> | undefined,
  options: Options,
) => Promise<ResponseProps> | Promise<void> | Promise<Error>

/** Fully resolved request options with serialized body and typed fetch fields, as produced by {@link buildActionOptions}. */
export type ResolvedActionOptions = Options & {
  body: string
  credentials: RequestCredentials
  headers: Record<string, string>
  method: string
  mode: RequestMode
}

/** Shape of a native fetch response consumed by {@link parseFetchResponse}. */
export type ParsedFetchResponse = {
  headers: Iterable<[string, string]>
  status: number
  text(): Promise<string>
}
