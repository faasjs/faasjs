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
   * onError: (action, params) => async (res) => {
   *   console.error(action, params, res)
   * }
   * ```
   */
  onError?: OnError
}

/**
 * Public interface returned by {@link FaasReactClient}.
 */
export type FaasReactClientInstance = {
  id: string
  faas: typeof faas
  useFaas: typeof useFaas
  FaasDataWrapper: typeof FaasDataWrapper
  onError?: OnError
  browserClient: FaasBrowserClient
}

/**
 * Create and register a FaasReactClient instance.
 *
 * The returned client is stored by `baseUrl` and becomes the default client
 * used by helpers such as {@link faas} and {@link useFaas}.
 *
 * @param options - Client configuration including base URL, default request options, and error hooks.
 * @returns Registered FaasReactClient instance.
 *
 * @example
 * ```ts
 * import { FaasReactClient } from '@faasjs/react'
 *
 * const client = FaasReactClient({
 *   baseUrl: 'http://localhost:8080/api/',
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
 *
 * @param host - Registered base URL to look up. Omit it to use the default client.
 * @returns Registered or newly created FaasReactClient instance.
 *
 * @example
 * ```ts
 * import { getClient } from '@faasjs/react'
 *
 * getClient()
 * getClient('http://localhost:8080/api/')
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
