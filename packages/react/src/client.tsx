import type { BaseUrl, Options, Response, ResponseError } from './browser'
import { FaasBrowserClient } from './browser'
import type { FaasAction, FaasActionUnionType, FaasData, FaasParams } from '@faasjs/types'
import {
  type FaasDataInjection,
  FaasDataWrapper,
  type FaasDataWrapperProps,
} from './FaasDataWrapper'
import { faas } from './faas'
import { useFaas, type useFaasOptions } from './useFaas'

const clients: {
  [key: string]: FaasReactClientInstance
} = {}

export type OnError = (
  action: string,
  params: Record<string, any>,
) => (res: ResponseError) => Promise<void>

export type FaasReactClientOptions = {
  /** @default `/` */
  baseUrl?: BaseUrl
  options?: Options
  /**
   * @example
   * ```ts
   * onError: (action, params) => async (res) => {
   *   console.error(action, params, res)
   * }
   * ```
   */
  onError?: OnError
}

export type FaasReactClientInstance = {
  id: string
  faas: typeof faas
  useFaas: typeof useFaas
  FaasDataWrapper: typeof FaasDataWrapper
  onError?: OnError
  browserClient: FaasBrowserClient
}

/**
 * Before use faas, you should initialize a FaasReactClient.
 *
 * @returns FaasReactClient instance.
 *
 * @example
 * ```ts
 * const client = FaasReactClient({
 *   baseUrl: 'localhost:8080/api/'
 * })
 * ```
 */
export function FaasReactClient(
  { baseUrl, options: clientOptions, onError }: FaasReactClientOptions = {
    baseUrl: '/',
  },
): FaasReactClientInstance {
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
 * Get FaasReactClient instance
 *
 * @param host {string} empty string for default host
 * @returns {FaasReactClientInstance}
 *
 * @example
 * ```ts
 * getClient()
 * // or
 * getClient('another-host')
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
