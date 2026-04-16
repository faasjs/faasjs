import type { FaasAction, FaasActionUnionType, FaasData, FaasParams } from '@faasjs/types'

import type { BaseUrl, Options, Response, ResponseError } from './browser'
import { FaasBrowserClient } from './browser'
import { faas } from './faas'
import {
  type FaasDataInjection,
  FaasDataWrapper,
  type FaasDataWrapperProps,
} from './FaasDataWrapper'
import { useFaas, type useFaasOptions } from './useFaas'

const clients: {
  [key: string]: FaasReactClientInstance
} = {}

/**
 * Factory for per-request error handlers used by {@link FaasReactClient}.
 *
 * @param {string} action - Action name that failed.
 * @param {Record<string, any>} params - Params sent with the failed request.
 * @returns {(res: ResponseError) => Promise<void>} Async callback invoked with the resulting {@link ResponseError}.
 */
export type OnError = (
  action: string,
  params: Record<string, any>,
) => (res: ResponseError) => Promise<void>

/**
 * Options for creating a {@link FaasReactClient} instance.
 */
export type FaasReactClientOptions = {
  /** @default `/` */
  baseUrl?: BaseUrl
  /** Default request options forwarded to the underlying browser client. */
  options?: Options
  /**
   * Error hook invoked when `faas` or `useFaas` receives a failed response.
   *
   * @example
   * ```ts
   * import { ResponseError } from '@faasjs/react'
   *
   * onError: (action, params) => async (res) => {
   *   if (res instanceof ResponseError) {
   *     reportErrorToSentry(res, {
   *       tags: { action },
   *       extra: { params },
   *     })
   *   }
   * }
   * ```
   */
  onError?: OnError
}

/**
 * Public interface returned by {@link FaasReactClient}.
 */
export type FaasReactClientInstance = {
  /** Unique identifier inherited from the underlying browser client. */
  id: string
  /** Promise-based request helper bound to the registered base URL. */
  faas: typeof faas
  /** Hook bound to the registered base URL. */
  useFaas: typeof useFaas
  /** Wrapper component bound to the registered base URL. */
  FaasDataWrapper: typeof FaasDataWrapper
  /** Optional error hook shared by `faas` and `useFaas`. */
  onError?: OnError
  /** Underlying browser client used for the actual HTTP requests. */
  browserClient: FaasBrowserClient
}

/**
 * Create and register a FaasReactClient instance.
 *
 * The returned client is stored by `baseUrl` and becomes the default client
 * used by helpers such as {@link faas} and {@link useFaas}.
 *
 * @param {FaasReactClientOptions} [options] - Client configuration including base URL, default request options, and error hooks.
 * @param {BaseUrl} [options.baseUrl] - Base URL used to register and route the client instance.
 * @param {Options} [options.options] - Default browser-client request options forwarded to `FaasBrowserClient`.
 * @param {OnError} [options.onError] - Hook factory used to handle failed `faas` and `useFaas` requests.
 * See {@link Options} for supported browser-client request fields such as `headers`,
 * `beforeRequest`, `request`, `baseUrl`, and `stream`.
 * @returns {FaasReactClientInstance} Registered FaasReactClient instance.
 *
 * @example
 * ```ts
 * import { FaasReactClient, ResponseError } from '@faasjs/react'
 *
 * const client = FaasReactClient({
 *   baseUrl: 'http://localhost:8080/api/',
 *   onError: (action, params) => async (res) => {
 *     if (res instanceof ResponseError) {
 *       reportErrorToSentry(res, {
 *         tags: { action },
 *         extra: { params },
 *       })
 *     }
 *   },
 * })
 * ```
 */
export function FaasReactClient(
  options: FaasReactClientOptions = {
    baseUrl: '/',
  },
): FaasReactClientInstance {
  const { baseUrl, options: clientOptions, onError } = options
  const resolvedBaseUrl: BaseUrl = baseUrl ?? '/'
  const client = new FaasBrowserClient(resolvedBaseUrl, clientOptions)

  function withBaseUrl<T extends { baseUrl?: BaseUrl }>(options?: T): T & { baseUrl: BaseUrl } {
    if (options?.baseUrl) return options as T & { baseUrl: BaseUrl }

    return {
      ...(options ?? ({} as T)),
      baseUrl: resolvedBaseUrl,
    }
  }

  const reactClient: FaasReactClientInstance = {
    id: client.id,
    faas: async <PathOrData extends FaasActionUnionType>(
      action: FaasAction<PathOrData>,
      params: FaasParams<PathOrData>,
      requestOptions?: Options,
    ): Promise<Response<FaasData<PathOrData>>> =>
      faas<PathOrData>(action, params, withBaseUrl(requestOptions)),
    useFaas: <PathOrData extends FaasActionUnionType>(
      action: FaasAction<PathOrData>,
      defaultParams: FaasParams<PathOrData>,
      requestOptions?: useFaasOptions<PathOrData>,
    ): FaasDataInjection<PathOrData> =>
      useFaas<PathOrData>(
        action,
        defaultParams,
        withBaseUrl<useFaasOptions<PathOrData>>(requestOptions),
      ),
    FaasDataWrapper: <PathOrData extends FaasActionUnionType>(
      props: FaasDataWrapperProps<PathOrData>,
    ) => <FaasDataWrapper<PathOrData> {...props} baseUrl={resolvedBaseUrl} />,
    ...(onError ? { onError } : {}),
    browserClient: client,
  }

  clients[resolvedBaseUrl] = reactClient

  return reactClient
}

/**
 * Get a registered FaasReactClient instance.
 *
 * When `host` is omitted, the first registered client is returned. If no client
 * has been created yet, a default client is initialized automatically.
 * Use `getClient` only for special cases such as multiple Faas clients with
 * different base URLs. In normal single-client app code, prefer the default
 * `faas`, `useFaas`, or `FaasReactClient` setup directly.
 *
 * @param {string} [host] - Registered base URL to look up. Omit it to use the default client.
 * @returns {FaasReactClientInstance} Registered or newly created FaasReactClient instance.
 *
 * @example
 * ```ts
 * import { FaasReactClient, getClient } from '@faasjs/react'
 *
 * FaasReactClient({
 *   baseUrl: 'https://service-a.example.com/api/',
 * })
 *
 * FaasReactClient({
 *   baseUrl: 'https://service-b.example.com/api/',
 * })
 *
 * const client = getClient('https://service-b.example.com/api/')
 *
 * await client.faas('/pages/posts/get', { id: 1 })
 * ```
 */
export function getClient(host?: string): FaasReactClientInstance {
  const client = clients[host || (Object.keys(clients)[0] as string)]

  if (!client) {
    console.warn('FaasReactClient is not initialized manually, use default.')

    return FaasReactClient()
  }

  return client
}
