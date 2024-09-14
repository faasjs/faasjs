import type {
  FaasDataInjection,
  FaasDataWrapperProps,
  FaasReactClientInstance,
  useFaasOptions,
} from './types'
import type { FaasAction, FaasData, FaasParams } from '@faasjs/types'
import type { Options, Response, ResponseError } from '@faasjs/browser'
import { FaasBrowserClient } from '@faasjs/browser'
import { FaasDataWrapper } from './FaasDataWrapper'
import { useFaas } from './useFaas'

const clients: {
  [key: string]: FaasReactClientInstance
} = {}

export type OnError = (
  action: string,
  params: Record<string, any>
) => (res: ResponseError) => Promise<void>

export type FaasReactClientOptions = {
  domain: string
  options?: Options
  onError?: OnError
}

/**
 * Before use faas, you should initialize a FaasReactClient.
 *
 * @param props.domain {string} The domain of your faas server
 * @param props.options {Options} The options of client
 * @returns {FaasReactClientInstance}
 *
 * @example
 * ```ts
 * const client = FaasReactClient({
 *   domain: 'localhost:8080/api'
 * })
 * ```
 */
export function FaasReactClient({
  domain,
  options,
  onError,
}: FaasReactClientOptions): FaasReactClientInstance {
  const client = new FaasBrowserClient(domain, options)

  async function faas<PathOrData extends FaasAction>(
    action: PathOrData | string,
    params: FaasParams<PathOrData>,
    options?: Options
  ): Promise<Response<FaasData<PathOrData>>> {
    if (onError)
      return client
        .action<PathOrData>(action, params, options)
        .catch(async res => {
          await onError(action as string, params)(res)
          return Promise.reject(res)
        })
    return client.action(action, params, options)
  }

  const reactClient = {
    id: client.id,
    faas,
    useFaas: <PathOrData extends FaasAction>(
      action: PathOrData | string,
      defaultParams: FaasParams<PathOrData>,
      options?: useFaasOptions<PathOrData>
    ): FaasDataInjection<FaasData<PathOrData>> =>
      useFaas(action, defaultParams, options),
    FaasDataWrapper: <PathOrData extends FaasAction>(
      props: FaasDataWrapperProps<PathOrData>
    ) => <FaasDataWrapper domain={domain} {...props} />,
    onError,
  }

  clients[domain] = reactClient

  return reactClient
}

/**
 * Get FaasReactClient instance
 *
 * @param domain {string} empty string for default domain
 * @returns {FaasReactClientInstance}
 *
 * @example
 * ```ts
 * getClient()
 * // or
 * getClient('another-domain')
 * ```
 */
export function getClient(domain?: string): FaasReactClientInstance {
  const client = clients[domain || Object.keys(clients)[0]]

  if (!client) {
    console.warn('FaasReactClient is not initialized manually, use default.')

    return FaasReactClient({
      domain: '/',
    })
  }

  return client
}

/**
 * Request faas server
 *
 * @param action {string} action name
 * @param params {object} action params
 * @returns {Promise<Response<any>>}
 *
 * @example
 * ```ts
 * faas<{ title: string }>('post/get', { id: 1 }).then(res => {
 *   console.log(res.data.title)
 * })
 * ```
 */
export async function faas<PathOrData extends FaasAction>(
  action: string | PathOrData,
  params: FaasParams<PathOrData>
): Promise<Response<FaasData<PathOrData>>> {
  return getClient().faas(action, params)
}
