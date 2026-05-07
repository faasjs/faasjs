/**
 * FaasJS browser client.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/react.svg)](https://github.com/faasjs/faasjs/blob/main/packages/react/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/react.svg)](https://www.npmjs.com/package/@faasjs/react)
 *
 * Browser client utilities for FaasJS.
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/react react
 * ```
 *
 * ## Usage
 *
 * ### Use directly
 *
 * ```ts
 * import { FaasBrowserClient } from '@faasjs/react'
 *
 * const client = new FaasBrowserClient('/')
 *
 * await client.action('func', { key: 'value' })
 * ```
 *
 * ### Use with SWR
 *
 * ```ts
 * import { FaasBrowserClient } from '@faasjs/react'
 * import useSWR from 'swr'
 *
 * const client = new FaasBrowserClient('/')
 *
 * const { data } = useSWR(['func', { key: 'value' }], client.action)
 * ```
 *
 * Reference: [Data Fetching - SWR](https://swr.vercel.app/docs/data-fetching)
 *
 * ### Use with React Query
 *
 * ```ts
 * import { FaasBrowserClient } from '@faasjs/react'
 * import { QueryClient } from 'react-query'
 *
 * const client = new FaasBrowserClient('/')
 *
 * const queryClient = new QueryClient({
 *   defaultOptions: {
 *     queries: {
 *       queryFn: async ({ queryKey }) => client
 *         .action(queryKey[0] as string, queryKey[1] as any)
 *         .then(data => data.data),
 *     },
 *   },
 * })
 *
 * function App() {
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       <YourApp />
 *     </QueryClientProvider>
 *   )
 * }
 * ```
 *
 * ### Use with React
 *
 * `@faasjs/react` includes both this browser client and React hooks/components.
 *
 * ## Error Handling
 *
 * FaasJS throws {@link ResponseError} when API requests fail. You can catch these errors
 * to handle different scenarios like network errors, server errors, or validation errors.
 *
 * The {@link ResponseError} class provides additional information about the failed request,
 * including the HTTP status code, response headers, and the full response body.
 *
 * @example
 * ```ts
 * import { FaasBrowserClient, ResponseError } from '@faasjs/react'
 *
 * const client = new FaasBrowserClient('https://api.example.com/')
 *
 * try {
 *   const response = await client.action('user', { id: 123 })
 *   console.log(response.data)
 * } catch (error) {
 *   if (error instanceof ResponseError) {
 *     console.error(`Request failed with status ${error.status}`)
 *     console.error(`Error message: ${error.message}`)
 *     console.error('Response body:', error.body)
 *
 *     if (error.status === 404) {
 *       console.log('Resource not found')
 *     } else if (error.status >= 500) {
 *       console.log('Server error, please try again later')
 *     }
 *   } else {
 *     console.error('Unexpected error:', error)
 *   }
 * }
 * ```
 *
 * ## Mock for Testing
 *
 * Use the global {@link setMock} function to mock API calls during tests. This allows you
 * to test your application without making actual network requests.
 *
 * Mocks are useful for:
 * - Unit testing client-side logic
 * - Integration testing with predictable responses
 * - Testing error handling scenarios
 * - Offline development
 *
 * @example
 * ```ts
 * import { FaasBrowserClient, setMock, ResponseError } from '@faasjs/react'
 *
 * // Set up a mock function
 * setMock(async (action, params) => {
 *   if (action === 'user') {
 *     // Return a successful response
 *     return { data: { id: params.id, name: 'Mock User' } }
 *   } else if (action === 'error') {
 *     // Throw an error to test error handling
 *     throw new ResponseError('Not found', {
 *       status: 404,
 *       body: { message: 'User not found' },
 *     })
 *   }
 * })
 *
 * // Create client - it will use the mock
 * const client = new FaasBrowserClient('https://api.example.com/')
 *
 * // This will use the mock and return the mocked data
 * const response = await client.action('user', { id: 123 })
 * console.log(response.data) // { id: 123, name: 'Mock User' }
 * ```
 *
 * ## API Reference
 *
 * ### Classes
 * - {@link FaasBrowserClient} - Main client class for making API requests to FaasJS functions
 * - {@link Response} - Response wrapper class containing status, headers, body, and data
 * - {@link ResponseError} - Custom error class for handling API request failures
 *
 * ### Types
 * - {@link Options} - Request options type for customizing client behavior
 * - {@link ResponseProps} - Response properties type for constructing Response objects
 * - {@link ResponseHeaders} - Headers type representing HTTP response headers
 * - {@link BaseUrl} - Base URL type with trailing slash requirement
 * - {@link MockHandler} - Mock handler function type for testing
 * - {@link FaasBrowserClientAction} - Action method type definition
 *
 * ### Functions
 * - {@link setMock} - Global mock function for intercepting API calls during testing
 *
 */
import type { FaasAction, FaasActionUnionType, FaasData, FaasParams } from '@faasjs/types'

import { generateId } from '../generateId'

export { generateId } from '../generateId'

/**
 * Template literal type for URL strings that must end with a forward slash.
 *
 * Ensures that base URLs used in FaasJS requests always have a trailing '/' character,
 * which is required for proper URL construction when appending action paths.
 *
 * Notes:
 * - Type only accepts strings ending with '/' (e.g., 'https://api.example.com/', '/')
 * - Strings without trailing '/' will fail TypeScript type checking
 * - Used by FaasBrowserClient constructor and Options type
 * - Ensures consistent URL formatting across the codebase
 * - Throws Error at runtime if baseUrl doesn't end with '/'
 *
 * @see {@link FaasBrowserClient} for usage in client creation.
 * @see {@link Options} for usage in request options.
 */
export type BaseUrl = `${string}/`

/**
 * Configuration options for FaasJS requests.
 *
 * Extends the standard RequestInit interface with FaasJS-specific options for
 * customizing request behavior, adding request hooks, and overriding defaults.
 *
 * Notes:
 * - Options can be provided at client creation (defaultOptions) or per-request
 * - Per-request options override client default options
 * - headers are merged: per-request headers override default headers
 * - beforeRequest hook is called before the request is sent, allowing modification
 * - Custom request function completely replaces the default fetch implementation
 * - baseUrl in options overrides the client's baseUrl for this specific request
 * - When stream is true, returns the native fetch Response instead of wrapped Response
 *
 * @property {Record<string, string>} [headers] - Default headers to include in all requests.
 *   Merged with client default headers, with per-request headers taking precedence.
 *   Common headers include Content-Type, Authorization, and custom application headers.
 *
 * @property {Function} [beforeRequest] - Async hook called before sending each request.
 *   Receives action, params, options, and headers, allowing modification before the request is sent.
 *   Useful for logging, authentication, adding timestamps, or modifying headers dynamically.
 *   Any changes to the headers object will affect the actual request.
 *
 * @property {Function} [request] - Custom request function to replace the default fetch.
 *   Allows using alternative HTTP clients like axios, XMLHttpRequest, or custom implementations.
 *   Receives the URL and parsed options, must return a Promise resolving to a Response object.
 *   When provided, this function is used instead of the native fetch API.
 *
 * @property {BaseUrl} [baseUrl] - Optional override for the base URL for this specific request.
 *   If provided, overrides the client's baseUrl. Must end with '/'.
 *   Useful for making requests to different endpoints or environments from the same client instance.
 *
 * @property {boolean} [stream] - Enable streaming mode for large responses.
 *   When true, returns the raw fetch Response object instead of a wrapped Response.
 *   Useful for processing large data incrementally or working with binary data streams.
 *   When false or undefined, returns a wrapped Response with automatic JSON parsing.
 *
 * @augments RequestInit
 * @see {@link FaasBrowserClient} for client creation.
 * @see {@link Response} for response object structure.
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
  request?: <PathOrData extends FaasActionUnionType>(
    url: string,
    options: Options,
  ) => Promise<Response<FaasData<PathOrData>>>
  /** Base URL override for the current request. */
  baseUrl?: BaseUrl
  /** When `true`, return the native fetch response so callers can consume the stream manually. */
  stream?: boolean
}

/**
 * Simple key-value object for HTTP response headers.
 *
 * Represents headers as a plain object with string keys and string values.
 * Used by Response, ResponseError, and Options types.
 *
 * @property {string} [key] - Dynamic string keys for header names (e.g., 'Content-Type', 'Authorization').
 *   Values must be strings. Multiple values for the same key are not supported.
 *
 * Notes:
 * - Headers are case-insensitive in HTTP but stored with exact casing in this object
 * - Common headers include: Content-Type, Authorization, x-faasjs-request-id, X-Custom-Header
 * - No support for multi-value headers (use comma-separated values instead)
 * - Used in Response, ResponseError, and Options types
 * - Simplified model compared to browser's Headers interface (no .get(), .set() methods)
 *
 * @see {@link Response} for usage in response objects.
 * @see {@link ResponseError} for usage in error objects.
 * @see {@link Options} for usage in request options.
 */
export type ResponseHeaders = {
  [key: string]: string
}

/**
 * Type definition for the FaasBrowserClient.action method.
 *
 * Defines the signature of the method used to make requests to FaasJS functions.
 * Provides type-safe parameter and return value handling.
 *
 * @template PathOrData - The function path or data type for type safety
 *
 * @param {FaasAction<PathOrData>} action - The function path to call.
 * @param {FaasParams<PathOrData>} [params] - Optional parameters for the function.
 * @param {Options} [options] - Optional request overrides.
 * See {@link Options} for supported request fields such as `headers`, `beforeRequest`,
 * `request`, `baseUrl`, and `stream`.
 * @returns {Promise<Response<FaasData<PathOrData>> | Response>} Promise resolving to the request response. In streaming mode the runtime returns the native fetch response.
 *
 * Notes:
 * - Used internally by FaasBrowserClient.action method
 * - Provides type-safe action method signature
 * - Return type includes both typed and untyped Response variants
 * - Params are optional and can be undefined
 * - Options override client defaults when provided
 *
 * @see {@link FaasBrowserClient} for the class that uses this type.
 * @see {@link Response} for the return type.
 * @see {@link Options} for the options parameter type.
 */
export type FaasBrowserClientAction = <PathOrData extends FaasActionUnionType>(
  action: FaasAction<PathOrData>,
  params?: FaasParams<PathOrData>,
  options?: Options,
) => Promise<Response<FaasData<PathOrData>> | Response>

/**
 * Properties for creating a Response object.
 *
 * Defines the structure of response data that can be passed to the Response constructor
 * or returned from mock handlers.
 *
 * @template T - The type of the data property for type-safe response creation
 *
 * @property {number} [status] - The HTTP status code for the response.
 *   Optional: defaults to 200 if data or body is provided, 204 otherwise.
 *
 * @property {ResponseHeaders} [headers] - The response headers as a key-value object.
 *   Optional: defaults to an empty object if not provided.
 *
 * @property {any} [body] - The raw response body as a string or object.
 *   Optional: if not provided, body is automatically populated from data using JSON.stringify.
 *
 * @property {T} [data] - The parsed JSON data to include in the response.
 *   Optional: contains the response payload when JSON data is provided.
 *
 * Notes:
 * - All properties are optional
 * - At least one of data or body should be provided for meaningful responses
 * - The Response class automatically defaults status to 200 or 204 based on content
 * - If data is provided without body, body is automatically JSON.stringify(data)
 * - Used by Response constructor and mock handlers
 *
 * @see {@link Response} for the class that uses these properties.
 * @see {@link ResponseErrorProps} for error response properties.
 */
export type ResponseProps<T = any> = {
  status?: number
  headers?: ResponseHeaders
  body?: any
  data?: T
}

/**
 * Wrapper class for HTTP responses from FaasJS functions.
 *
 * Provides a consistent interface for handling server responses with status code, headers,
 * body, and parsed data. Automatically handles JSON serialization and status code defaults.
 *
 * @template T - The type of the data property for type-safe response handling
 *
 * @property {number} status - The HTTP status code of the response.
 *   Defaults to 200 if data or body is provided, 204 if neither is present.
 * @property {ResponseHeaders} headers - The response headers as a key-value object.
 *   Empty object if no headers were provided.
 * @property {any} body - The raw response body as a string or object.
 *   If data is provided without body, body is automatically set to JSON.stringify(data).
 * @property {T} [data] - The parsed JSON data from the response.
 *   Optional property that contains the response payload when JSON is provided.
 *
 * Notes:
 * - status defaults to 200 if data or body is present, 204 otherwise
 * - body is automatically populated from data if not explicitly provided
 * - headers defaults to an empty object if not provided
 * - Use generic type parameter T for type-safe data access
 * - Commonly used as the return type from client.action() method
 * - Can be used in mock handlers to return structured responses
 * - The data property is optional and may be undefined for responses without data
 *
 * @example Create successful response with data
 * ```ts
 * const response = new Response({
 *   status: 200,
 *   data: {
 *     id: 123,
 *     name: 'John Doe'
 *   }
 * })
 * console.log(response.status) // 200
 * console.log(response.data.name) // 'John Doe'
 * ```
 *
 * @example Create response with type safety
 * ```ts
 * interface User {
 *   id: number
 *   name: string
 *   email: string
 * }
 *
 * const response = new Response<User>({
 *   data: {
 *     id: 123,
 *     name: 'John',
 *     email: 'john@example.com'
 *   }
 * })
 * // TypeScript knows response.data.name is a string
 * ```
 *
 * @example Create response with headers
 * ```ts
 * const response = new Response({
 *   status: 201,
 *   data: { created: true },
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'x-faasjs-request-id': 'req-123',
 *     'X-Cache-Key': 'user-123'
 *   }
 * })
 * ```
 *
 * @example Create response with custom body
 * ```ts
 * const response = new Response({
 *   status: 200,
 *   body: JSON.stringify({ custom: 'format' }),
 *   headers: { 'Content-Type': 'application/json' }
 * })
 * ```
 *
 * @example Create empty response (204 No Content)
 * ```ts
 * const response = new Response()
 * // status: 204, headers: {}, body: undefined, data: undefined
 * ```
 *
 * @example Create error response
 * ```ts
 * const response = new Response({
 *   status: 404,
 *   data: {
 *     error: {
 *       message: 'User not found',
 *       code: 'USER_NOT_FOUND'
 *     }
 *   }
 * })
 * ```
 *
 * @example Use in mock handler
 * ```ts
 * setMock(async (action, params) => {
 *   if (action === 'user') {
 *     return new Response({
 *       status: 200,
 *       data: { id: params.id, name: 'Mock User' }
 *     })
 *   }
 *   return new Response({ status: 404, data: { error: 'Not found' } })
 * })
 * ```
 *
 * @see {@link ResponseProps} for response property type.
 * @see {@link ResponseError} for error response handling.
 * @see {@link FaasBrowserClient.action} for method returning Response.
 */
export class Response<T = any> {
  /**
   * HTTP status code exposed to callers.
   */
  public readonly status: number
  /**
   * Response headers keyed by header name.
   */
  public readonly headers: ResponseHeaders
  /**
   * Raw response body.
   */
  public readonly body: any
  /**
   * Parsed response payload when JSON data is available.
   */
  public readonly data?: T

  /**
   * Create a wrapped response object.
   *
   * @param {ResponseProps<T>} [props] - Response properties including status, headers, body, and data.
   * @param {number} [props.status] - HTTP status code. Defaults to `200` when `data` or `body` exists, otherwise `204`.
   * @param {ResponseHeaders} [props.headers] - Response headers keyed by header name.
   * @param {any} [props.body] - Raw response body to expose without additional parsing.
   * @param {T} [props.data] - Parsed response payload to expose on `response.data`.
   * @returns {Response<T>} Wrapped response instance.
   */
  constructor(props: ResponseProps<T> = {}) {
    this.status = props.status || (props.data || props.body ? 200 : 204)
    this.headers = props.headers || {}
    this.body = props.body
    if (props.data !== undefined) this.data = props.data

    if (props.data && !props.body) this.body = JSON.stringify(props.data)
  }
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
 * Custom error class for handling HTTP response errors from FaasJS requests.
 *
 * Extends the built-in Error class to provide additional information about failed requests,
 * including HTTP status code, response headers, response body, and the original error.
 *
 * @augments Error
 *
 * @property {number} status - The HTTP status code of the failed response. Defaults to 500 if not provided.
 * @property {ResponseHeaders} headers - The response headers from the failed request.
 * @property {any} body - The response body containing error details or the original error if available.
 * @property {Error} [originalError] - The original Error object if this ResponseError was created from another Error.
 *
 * @example Basic error with message
 * ```ts
 * throw new ResponseError('User not found')
 * // or inside action method:
 * catch (error) {
 *   throw new ResponseError(error.message)
 * }
 * ```
 *
 * @example Error from existing Error
 * ```ts
 * try {
 *   await someOperation()
 * } catch (error) {
 *   throw new ResponseError(error, {
 *     status: 500,
 *     headers: { 'X-Error-Type': 'internal' }
 *   })
 * }
 * ```
 *
 * @example Error with complete response details
 * ```ts
 * throw new ResponseError({
 *   message: 'Validation failed',
 *   status: 400,
 *   headers: { 'X-Error-Code': 'VALIDATION_ERROR' },
 *   body: {
 *     error: {
 *       message: 'Validation failed',
 *       fields: ['email', 'password']
 *     }
 *   }
 * })
 * ```
 *
 * @example Handling ResponseError in client
 * ```ts
 * try {
 *   const response = await client.action('user', { id: 123 })
 *   console.log(response.data)
 * } catch (error) {
 *   if (error instanceof ResponseError) {
 *     console.error(`Request failed: ${error.message}`)
 *     console.error(`Status: ${error.status}`)
 *     if (error.body) {
 *       console.error('Error details:', error.body)
 *     }
 *     if (error.headers['x-faasjs-request-id']) {
 *       console.error('Request ID:', error.headers['x-faasjs-request-id'])
 *     }
 *   }
 * }
 * ```
 *
 * @example Throwing ResponseError from mock
 * ```ts
 * setMock(async (action, params) => {
 *   if (action === 'login') {
 *     if (!params.email || !params.password) {
 *       throw new ResponseError({
 *         message: 'Email and password are required',
 *         status: 400,
 *         body: { error: 'missing_fields' }
 *       })
 *     }
 *     return { data: { token: 'abc123' } }
 *   }
 * })
 * ```
 *
 * Notes:
 * - ResponseError is automatically thrown by the action method when the server returns an error (status >= 400)
 * - The error message from server responses is extracted from body.error.message if available
 * - When created from an Error object, the original error is preserved in the originalError property
 * - The status property defaults to 500 if not explicitly provided
 * - Use instanceof ResponseError to distinguish FaasJS errors from other JavaScript errors
 * - The body property can contain structured error information from the server response
 *
 * @see {@link FaasBrowserClient.action} for how ResponseError is thrown in requests.
 * @see {@link ResponseProps} for the structure of response data.
 * @see {@link setMock} for mocking errors in tests.
 */
export class ResponseError extends Error {
  /**
   * HTTP status code reported for the failed request.
   */
  public readonly status: number
  /**
   * Response headers returned with the error.
   */
  public readonly headers: ResponseHeaders
  /**
   * Raw error body or fallback error payload.
   */
  public readonly body: any
  /**
   * Original error used to construct this instance, when available.
   */
  public readonly originalError?: Error

  /**
   * Create a ResponseError from a message, Error, or structured response error payload.
   *
   * @param {string | Error | ResponseErrorProps} data - Error message, Error object, or structured response error props.
   * @param {string} data.message - User-facing error message when `data` is a structured object.
   * @param {number} [data.status] - HTTP status code when `data` is a structured object.
   * @param {ResponseHeaders} [data.headers] - Response headers returned with the error when `data` is a structured object.
   * @param {any} [data.body] - Raw error body or structured error payload when `data` is a structured object.
   * @param {Error} [data.originalError] - Original error preserved on the instance when `data` is a structured object.
   * @param {Omit<ResponseErrorProps, 'message' | 'originalError'>} [options] - Additional options such as status, headers, and body.
   * @param {number} [options.status] - HTTP status override used when `data` is a string or `Error`.
   * @param {ResponseHeaders} [options.headers] - Response headers override used when `data` is a string or `Error`.
   * @param {any} [options.body] - Raw error body override used when `data` is a string or `Error`.
   * @returns {ResponseError} ResponseError instance.
   */
  constructor(data: string | Error, options?: Omit<ResponseErrorProps, 'message' | 'originalError'>)
  constructor(data: ResponseErrorProps)
  constructor(
    data: string | Error | ResponseErrorProps,
    options?: Omit<ResponseErrorProps, 'message' | 'originalError'>,
  ) {
    let props: ResponseErrorProps
    if (typeof data === 'string') {
      props = { message: data, ...options }
    } else if (
      data instanceof Error ||
      (typeof data === 'object' &&
        data !== null &&
        typeof data.constructor?.name === 'string' &&
        data.constructor.name.includes('Error'))
    ) {
      props = {
        message: data.message,
        originalError: data as Error,
        ...options,
      }
    } else {
      props = data
    }

    super(props.message)

    this.status = props.status || 500
    this.headers = props.headers || {}
    this.body = props.body || props.originalError || { error: { message: props.message } }
    if (props.originalError) this.originalError = props.originalError
  }
}

/**
 * Mock handler function type for testing FaasJS requests.
 *
 * Defines the signature for functions that can mock API requests during testing.
 * Mock handlers receive request parameters and return simulated responses or errors.
 *
 * @param {string} action - The function path/action being requested (for example, `user` or `data/list`).
 *   Converted to lowercase by the client before being passed to the handler.
 *
 * @param {Record<string, any> | undefined} params - The parameters passed to the action.
 *   May be undefined if the action was called without parameters.
 *   Parameters are passed as a plain object (already JSON-serialized if needed).
 *
 * @param {Options} options - The full request options including headers, beforeRequest hook, and other config.
 *   Includes X-FaasJS-Request-Id header in the headers object.
 *   Contains merged client defaults and per-request options.
 *   See {@link Options} for supported request fields such as `headers`, `beforeRequest`,
 *   `request`, `baseUrl`, and `stream`.
 *
 * @returns {Promise<ResponseProps> | Promise<void> | Promise<Error>} A promise resolving to:
 *   - ResponseProps: Mock response data (status, headers, body, data)
 *   - void: Returns an empty response (204 No Content)
 *   - Error: Throws ResponseError when returning an Error object
 *
 * Notes:
 * - Used by setMock() function to mock API calls during tests
 * - Affects all FaasBrowserClient instances when set globally
 * - Can return different responses based on action or params
 * - Returning an Error object causes the action() method to reject with ResponseError
 * - Async function - must return a Promise
 * - Receives the fully merged options including default headers
 * @see {@link setMock} for setting up mock handlers.
 * @see {@link ResponseProps} for response structure.
 * @see {@link ResponseError} for error handling.
 */
export type MockHandler = (
  action: string,
  params: Record<string, any> | undefined,
  options: Options,
) => Promise<ResponseProps> | Promise<void> | Promise<Error>

let mock: MockHandler | ResponseProps | Response | null | undefined = null

/**
 * Set the global mock handler used by all {@link FaasBrowserClient} instances.
 *
 * @param {MockHandler | ResponseProps | Response | null | undefined} handler - Mock handler, can be:
 *   - MockHandler function: receives (action, params, options) and returns response data
 *   - ResponseProps object: static response data
 *   - Response instance: pre-configured Response object
 *   - null or undefined: clear mock
 *
 * @example Reset in Vitest shared setup
 * ```ts
 * import { afterEach } from 'vitest'
 *
 * afterEach(() => {
 *   setMock(null)
 * })
 * ```
 *
 * @example Use ResponseProps object
 * ```ts
 * setMock({
 *   data: { name: 'FaasJS' },
 * })
 *
 * setMock({
 *   status: 500,
 *   data: { message: 'Internal Server Error' },
 * })
 * ```
 *
 * @example Use MockHandler function
 * ```ts
 * setMock(async (action) => {
 *   if (action === '/pages/users/get') {
 *     return { data: { id: 1, name: 'FaasJS' } }
 *   }
 *
 *   return { status: 404, data: { message: 'Not Found' } }
 * })
 *
 * const response = await client.action('/pages/users/get')
 * ```
 *
 * @example Branch by action and params
 * ```ts
 * setMock(async (action, params) => {
 *   if (action === '/pages/users/get' && params?.id === 1) {
 *     return { data: { id: 1, name: 'Admin' } }
 *   }
 *
 *   if (action === '/pages/users/get' && params?.id === 2) {
 *     return { data: { id: 2, name: 'Editor' } }
 *   }
 *
 *   return { status: 404, data: { message: 'User not found' } }
 * })
 * ```
 *
 * @example Use Response instance
 * ```ts
 * setMock(new Response({
 *   status: 200,
 *   data: { result: 'success' }
 * }))
 * ```
 *
 * @example Streaming response
 * ```ts
 * setMock({
 *   body: new ReadableStream({
 *     start(controller) {
 *       controller.enqueue(new TextEncoder().encode('hello'))
 *       controller.enqueue(new TextEncoder().encode(' world'))
 *       controller.close()
 *     },
 *   }),
 * })
 * ```
 *
 * @example Clear mock
 * ```ts
 * setMock(null)
 * ```
 *
 * @example Handle errors
 * ```ts
 * setMock(async () => {
 *   throw new Error('Internal error')
 * })
 * // This will reject with ResponseError
 * ```
 */
export function setMock(handler: MockHandler | ResponseProps | Response | null | undefined) {
  mock = handler
}

type ResolvedActionOptions = Options & {
  body: string
  credentials: RequestCredentials
  headers: Record<string, string>
  method: string
  mode: RequestMode
}

type ParsedFetchResponse = {
  headers: Iterable<[string, string]>
  status: number
  text(): Promise<string>
}

function buildActionUrl(
  action: string,
  baseUrl: BaseUrl,
  options?: Options,
  requestId?: string,
): string {
  return `${(options?.baseUrl || baseUrl) + action.toLowerCase()}?_=${requestId}`
}

function buildActionOptions(
  defaultOptions: Options,
  options: Options | undefined,
  params: Record<string, any>,
  requestId: string,
): ResolvedActionOptions {
  const resolvedOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    mode: 'cors' as RequestMode,
    credentials: 'include' as RequestCredentials,
    body: JSON.stringify(params),
    ...defaultOptions,
    ...(options || Object.create(null)),
  } as ResolvedActionOptions

  if (
    !resolvedOptions.headers['X-FaasJS-Request-Id'] &&
    !resolvedOptions.headers['x-faasjs-request-id']
  )
    resolvedOptions.headers['X-FaasJS-Request-Id'] = requestId

  return resolvedOptions
}

async function runBeforeRequest(
  action: string,
  params: Record<string, any>,
  options: ResolvedActionOptions,
): Promise<void> {
  if (!options.beforeRequest) return

  await options.beforeRequest({
    action,
    params,
    options,
    headers: options.headers,
  })
}

function normalizeMockResponse<T>(
  response: ResponseProps<T> | Response<T> | void | Error,
): Response<T> {
  if (response instanceof Error) throw new ResponseError(response)
  if (response instanceof Response) {
    if (
      typeof ReadableStream !== 'undefined' &&
      response.body instanceof ReadableStream &&
      response.body.locked === false
    ) {
      const [nextBody, currentBody] = response.body.tee()
      ;(response as Response<T> & { body: ReadableStream }).body = nextBody

      const clonedResponse: ResponseProps<T> = {
        status: response.status,
        headers: response.headers,
        body: currentBody,
      }

      if (response.data !== undefined) clonedResponse.data = response.data

      return new Response({
        ...clonedResponse,
      })
    }

    return response
  }

  if (
    response &&
    typeof ReadableStream !== 'undefined' &&
    response.body instanceof ReadableStream &&
    response.body.locked === false
  ) {
    const [nextBody, currentBody] = response.body.tee()
    response.body = nextBody

    return new Response({
      ...response,
      body: currentBody,
    })
  }

  return new Response(response || {})
}

async function resolveMockResponse<PathOrData extends FaasActionUnionType>(
  action: string,
  params: Record<string, any>,
  options: ResolvedActionOptions,
): Promise<Response<FaasData<PathOrData>>> {
  if (typeof mock === 'function') {
    const response = await mock(action, params, options)

    return normalizeMockResponse(response as ResponseProps<FaasData<PathOrData>> | Error | void)
  }

  return normalizeMockResponse(mock as ResponseProps<FaasData<PathOrData>> | Response)
}

function toResponseHeaders(headers: Iterable<[string, string]>): ResponseHeaders {
  const responseHeaders: ResponseHeaders = {}

  for (const [key, value] of headers) responseHeaders[key] = value

  return responseHeaders
}

function parseSuccessfulResponse<PathOrData extends FaasActionUnionType>(
  status: number,
  headers: ResponseHeaders,
  text: string,
): Response<FaasData<PathOrData>> {
  if (!text)
    return new Response({
      status,
      headers,
    })

  const body = JSON.parse(text)

  if (body.error?.message)
    throw new ResponseError({
      message: body.error.message,
      status,
      headers,
      body,
    })

  return new Response({
    status,
    headers,
    body,
    data: body.data,
  })
}

function parseFailedResponse(status: number, headers: ResponseHeaders, text: string): never {
  try {
    const body = JSON.parse(text)

    if (body.error?.message)
      throw new ResponseError({
        message: body.error.message,
        status,
        headers,
        body,
      })

    throw new ResponseError({
      message: text,
      status,
      headers,
      body,
    })
  } catch (error) {
    if (error instanceof ResponseError) throw error

    throw new ResponseError({
      message: text,
      status,
      headers,
      body: text,
    })
  }
}

async function parseFetchResponse<PathOrData extends FaasActionUnionType>(
  response: ParsedFetchResponse,
): Promise<Response<FaasData<PathOrData>>> {
  const headers = toResponseHeaders(response.headers)
  const text = await response.text()

  if (response.status >= 200 && response.status < 300)
    return parseSuccessfulResponse<PathOrData>(response.status, headers, text)

  return parseFailedResponse(response.status, headers, text)
}

/**
 * Browser client for FaasJS - provides HTTP client functionality for making API requests from web applications.
 *
 * @template PathOrData - Type parameter extending FaasActionUnionType for type-safe requests
 *
 * Features:
 * - Type-safe API requests with TypeScript support
 * - Built-in mock support for testing
 * - Custom request function support
 * - Request/response hooks (beforeRequest)
 * - Automatic error handling with ResponseError
 * - Streaming support for large responses
 * - Multiple instance support with unique IDs
 *
 * Notes:
 * - All requests are POST requests by default
 * - Automatically adds X-FaasJS-Request-Id header for request tracking
 * - baseUrl must end with '/' (will throw Error if not)
 * - Supports global mock via setMock() for testing all instances
 *
 * @example Basic usage
 * ```ts
 * import { FaasBrowserClient } from '@faasjs/react'
 *
 * const client = new FaasBrowserClient('http://localhost:8080/')
 * const response = await client.action('func', { key: 'value' })
 * console.log(response.data)
 * ```
 *
 * @example With custom headers and options
 * ```ts
 * const client = new FaasBrowserClient('https://api.example.com/', {
 *   headers: { 'X-API-Key': 'secret' },
 *   beforeRequest: async ({ action, params, headers }) => {
 *     console.log(`Calling ${action} with params:`, params)
 *   }
 * })
 * ```
 *
 * @example Multiple instances
 * ```ts
 * const apiClient = new FaasBrowserClient('https://api.example.com/')
 * const localClient = new FaasBrowserClient('http://localhost:3000/')
 *
 * const apiData = await apiClient.action('users')
 * const localData = await localClient.action('data')
 * ```
 *
 * @example Error handling
 * ```ts
 * const client = new FaasBrowserClient('https://api.example.com/')
 *
 * try {
 *   const response = await client.action('user', { id: 123 })
 *   console.log(response.data)
 * } catch (error) {
 *   if (error instanceof ResponseError) {
 *     console.error(`Request failed: ${error.message}`, error.status)
 *   } else {
 *     console.error('Unexpected error:', error)
 *   }
 * }
 * ```
 *
 * @throws {Error} When baseUrl does not end with '/'
 *
 * @see {@link setMock} for testing support.
 * @see {@link ResponseError} for error handling.
 */
export class FaasBrowserClient {
  /**
   * Unique identifier for this client instance.
   */
  public readonly id: string
  /**
   * Base URL used to build action request URLs.
   */
  public baseUrl: BaseUrl
  /**
   * Default request options merged into every request.
   */
  public defaultOptions: Options

  /**
   * Creates a new FaasBrowserClient instance.
   *
   * @param {BaseUrl} [baseUrl] - Base URL for all API requests. Must end with `/`. Defaults to `/` for relative requests.
   * @param {Options} [options] - Default request options such as headers, hooks, request override, or stream mode.
   * See {@link Options} for supported request fields such as `headers`, `beforeRequest`,
   * `request`, `baseUrl`, and `stream`.
   *
   * @example Basic initialization
   * ```ts
   * const client = new FaasBrowserClient('/')
   * ```
   *
   * @example With API endpoint
   * ```ts
   * const client = new FaasBrowserClient('https://api.example.com/')
   * ```
   *
   * @example With custom headers
   * ```ts
   * const client = new FaasBrowserClient('https://api.example.com/', {
   *   headers: {
   *     'Authorization': 'Bearer token123',
   *     'X-Custom-Header': 'value'
   *   }
   * })
   * ```
   *
   * @example With beforeRequest hook
   * ```ts
   * const client = new FaasBrowserClient('https://api.example.com/', {
   *   beforeRequest: async ({ action, params, headers }) => {
   *     console.log(`Requesting ${action}`, params)
   *     // Modify headers before request
   *     headers['X-Timestamp'] = Date.now().toString()
   *   }
   * })
   * ```
   *
   * @example With custom request function
   * ```ts
   * import axios from 'axios'
   *
   * const client = new FaasBrowserClient('/', {
   *   request: async (url, options) => {
   *     const response = await axios.post(url, options.body, {
   *       headers: options.headers
   *     })
   *     return new Response({
   *       status: response.status,
   *       headers: response.headers,
   *       data: response.data
   *     })
   *   }
   * })
   * ```
   *
   * @throws {Error} When `baseUrl` does not end with `/`
   */
  constructor(baseUrl: BaseUrl = '/', options: Options = Object.create(null)) {
    if (baseUrl && !baseUrl.endsWith('/')) throw Error('[FaasJS] baseUrl should end with /')

    this.id = `FBC-${generateId()}`
    this.baseUrl = baseUrl
    this.defaultOptions = options
  }

  /**
   * Makes a request to a FaasJS function.
   *
   * @template PathOrData - The function path or data type for type safety
   * @param {FaasAction<PathOrData>} action - The function path to call. Converted to lowercase when constructing the URL.
   *   Must be a non-empty string.
   * @param {FaasParams<PathOrData>} [params] - The parameters to send to the function. Will be serialized as JSON.
   *   Optional if the function accepts no parameters.
   * @param {Options} [options] - Optional request options that override client defaults.
   *   Supports headers, beforeRequest hook, custom request function, baseUrl override, and streaming mode.
   *   See {@link Options} for supported request fields such as `headers`, `beforeRequest`,
   *   `request`, `baseUrl`, and `stream`.
   *
   * @returns {Promise<Response<FaasData<PathOrData>>>} A promise resolving to the wrapped FaasJS response. When `options.stream`
   *   is `true`, the runtime returns the native fetch response so callers can read the stream.
   *
   * @throws {Error} When action is not provided or is empty
   * @throws {ResponseError} When the server returns an error response (status >= 400 or body.error exists)
   * @throws {Error} When the request fails before a response is received
   *
   * Notes:
   * - All requests are POST requests by default
   * - Action path is automatically converted to lowercase
   * - A unique request ID is generated for each request and sent in X-FaasJS-Request-Id header
   * - Headers are merged from client defaults and request options (request options take precedence)
   * - If a global mock is set via setMock(), it will be used instead of making real requests
   * - If a custom request function is provided in options, it will be used instead of fetch
   * - When stream option is true, returns the native fetch Response instead of a wrapped Response
   * - Response body is automatically parsed as JSON when possible
   * - Server errors (body.error) are automatically converted to ResponseError
   *
   * @example Basic request
   * ```ts
   * const response = await client.action('user', { id: 123 })
   * console.log(response.data)
   * ```
   *
   * @example With no parameters
   * ```ts
   * const response = await client.action('status')
   * console.log(response.data.status)
   * ```
   *
   * @example With custom options
   * ```ts
   * const response = await client.action('data', {
   *   limit: 10,
   *   offset: 0
   * }, {
   *   headers: { 'X-Custom-Header': 'value' }
   * })
   * ```
   *
   * @example Streaming large response
   * ```ts
   * const response = await client.action('stream', {
   *   format: 'json'
   * }, {
   *   stream: true
   * })
   * // response is native fetch Response with streaming support
   * const reader = response.body.getReader()
   * ```
   *
   * @example With type safety
   * ```ts
   * interface UserData {
   *   id: number
   *   name: string
   *   email: string
   * }
   *
   * const response = await client.action<UserData>('user', { id: 123 })
   * console.log(response.data.name) // TypeScript knows it's a string
   * ```
   *
   * @example Handling errors
   * ```ts
   * try {
   *   const response = await client.action('user', { id: 123 })
   *   console.log(response.data)
   * } catch (error) {
   *   if (error instanceof ResponseError) {
   *     console.error(`Server error: ${error.message}`, error.status)
   *     if (error.body) console.error('Error details:', error.body)
   *   } else {
   *     console.error('Network error:', error)
   *   }
   * }
   * ```
   *
   * @example Chaining requests
   * ```ts
   * const userId = await client.action('createUser', {
   *   name: 'John',
   *   email: 'john@example.com'
   * })
   *
   * const profile = await client.action('getProfile', {
   *   userId: userId.data.id
   * })
   * ```
   */
  public async action<PathOrData extends FaasActionUnionType>(
    action: FaasAction<PathOrData>,
    params?: FaasParams<PathOrData>,
    options?: Options,
  ): Promise<Response<FaasData<PathOrData>>> {
    if (!action) throw Error('[FaasJS] action required')

    if (!params) params = Object.create(null)
    const requestId = `F-${generateId()}`
    const url = buildActionUrl(action as string, this.baseUrl, options, requestId)
    const resolvedOptions = buildActionOptions(
      this.defaultOptions,
      options,
      params as Record<string, any>,
      requestId,
    )

    await runBeforeRequest(action as string, params as Record<string, any>, resolvedOptions)

    if (mock)
      return resolveMockResponse<PathOrData>(
        action as string,
        params as Record<string, any>,
        resolvedOptions,
      )

    if (resolvedOptions.request) return resolvedOptions.request(url, resolvedOptions)

    if (resolvedOptions.stream)
      return fetch(url, resolvedOptions) as unknown as Promise<Response<FaasData<PathOrData>>>

    return parseFetchResponse<PathOrData>(
      (await fetch(url, resolvedOptions)) as ParsedFetchResponse,
    )
  }
}
