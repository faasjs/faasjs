import type { FaasActionPaths, FaasData, FaasParams } from '@faasjs/types'

import { generateId } from '../generate-id'
import { buildActionUrl, buildActionOptions, runBeforeRequest, parseFetchResponse } from './helpers'
import { mock, resolveMockResponse } from './mock'
import type { Response } from './response'
import type { Options, BaseUrl, ParsedFetchResponse } from './types'

/**
 * Browser client for FaasJS - provides HTTP client functionality for making API requests from web applications.
 *
 * Handles request URL construction, default and per-request option merging,
 * before-request hooks, mock resolution for testing, and native fetch dispatching.
 *
 * @example
 * ```ts
 * import { FaasBrowserClient } from '@faasjs/react'
 *
 * const client = new FaasBrowserClient('https://api.example.com/', {
 *   headers: { 'X-Custom-Header': 'value' },
 * })
 *
 * const response = await client.action('posts/get', { id: 1 })
 * console.log(response.data)
 * ```
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
   * @param {BaseUrl} [baseUrl='/'] - Base URL used to build action request URLs. Must end with `/`.
   * @param {Options} [options={}] - Default request options merged into every request.
   * @throws {Error} When `baseUrl` does not end with a forward slash.
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
   * Builds the request URL and resolved options, runs `beforeRequest` hooks,
   * checks for mock handlers, and dispatches via native `fetch` or custom `request`.
   * When `stream` is enabled the raw fetch response is returned so callers can
   * consume the body stream themselves.
   *
   * @template Path - Action path used to infer the request params and response data types.
   * @param {Path} action - Action path to invoke. Must be non-empty.
   * @param {FaasParams<Path>} [params] - Params sent to the action. Defaults to an empty object.
   * @param {Options} [options] - Per-request overrides on top of client defaults.
   * @returns {Promise<Response<FaasData<Path>>>} FaasJS response containing the parsed data, or native fetch response when streaming.
   * @throws {Error} When `action` is empty or falsy.
   */
  public async action<Path extends FaasActionPaths>(
    action: Path,
    params: FaasParams<Path>,
    options?: Options,
  ): Promise<Response<FaasData<Path>>> {
    if (!action) throw Error('[FaasJS] action required')

    if (!params) params = Object.create(null)
    const requestId = `F-${generateId()}`
    const url = buildActionUrl(action, this.baseUrl, options, requestId)
    const resolvedOptions = buildActionOptions<Path>(
      this.defaultOptions,
      options,
      params,
      requestId,
    )

    await runBeforeRequest<Path>(action, params, resolvedOptions)

    if (mock)
      return resolveMockResponse<Path>(
        action as string,
        params as Record<string, any>,
        resolvedOptions,
      )

    if (resolvedOptions.request) return resolvedOptions.request(url, resolvedOptions)

    if (resolvedOptions.stream)
      return fetch(url, resolvedOptions) as unknown as Promise<Response<FaasData<Path>>>

    return parseFetchResponse<Path>((await fetch(url, resolvedOptions)) as ParsedFetchResponse)
  }
}
