import type { FaasActionPaths, FaasData, FaasParams } from '@faasjs/types'

import { generateId } from '../generate-id'
import { buildActionUrl, buildActionOptions, runBeforeRequest, parseFetchResponse } from './helpers'
import { mock, resolveMockResponse } from './mock'
import type { Response } from './response'
import type { Options, BaseUrl, ParsedFetchResponse } from './types'

/**
 * Browser client for FaasJS - provides HTTP client functionality for making API requests from web applications.
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
   */
  constructor(baseUrl: BaseUrl = '/', options: Options = Object.create(null)) {
    if (baseUrl && !baseUrl.endsWith('/')) throw Error('[FaasJS] baseUrl should end with /')

    this.id = `FBC-${generateId()}`
    this.baseUrl = baseUrl
    this.defaultOptions = options
  }

  /**
   * Makes a request to a FaasJS function.
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
