import type { FaasAction, FaasActionUnionType, FaasData, FaasParams } from '@faasjs/types'

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
