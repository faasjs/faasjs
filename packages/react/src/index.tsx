import {
  FaasBrowserClient, Options, Response, ResponseError
} from '@faasjs/browser'

import {
  FaasAction, FaasData, FaasParams
} from '@faasjs/types'

import {
  useState, useEffect, createElement
} from 'react'

import useSWR, { useSWRConfig } from 'swr'

export type {
  FaasBrowserClient, Options, Response, ResponseHeaders, ResponseError
} from '@faasjs/browser'

/**
 * Injects FaasData props.
 */
export type FaasDataInjection<Data = any> = {
  action: string | any
  params: Record<string, any>
  loading: boolean
  data: Data
  error: any
  reload(params?: Record<string, any>): Promise<Response<Data>>,
}

export type FaasDataWrapperProps<PathOrData extends FaasAction> = {
  render?(args: FaasDataInjection<FaasData<PathOrData>>): JSX.Element | JSX.Element[]
  fallback?: JSX.Element | false
  action: string
  params?: FaasParams<PathOrData>
  onDataChange?(args: FaasDataInjection<FaasData<PathOrData>>): void
  /** use custom data, should work with setData */
  data?: FaasData<PathOrData>
  /** use custom setData, should work with data */
  setData?: React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>
}

export type FaasReactClientInstance = {
  faas: <PathOrData extends FaasAction>(
    action: string | PathOrData,
    params: FaasParams<PathOrData>
  ) => Response<FaasData<PathOrData>>
  useFaas: <PathOrData extends FaasAction>(
    action: string | PathOrData,
    defaultParams: FaasParams<PathOrData>
  ) => FaasDataInjection<FaasData<PathOrData>>
  FaasDataWrapper<PathOrData extends FaasAction>(props: FaasDataWrapperProps<PathOrData>): JSX.Element
}

const clients: {
  [key: string]: FaasReactClientInstance
} = {}

/**
 * Before use faas, you should initialize a FaasReactClient.
 *
 * @param props.domain {string} The domain of your faas server
 * @param props.options {Options} The options of client
 * @returns {FaasReactClientInstance}
 *
 * ```ts
 * const client = FaasReactClient({
 *   domain: 'localhost:8080/api'
 * })
 * ```
 */
export function FaasReactClient ({
  domain,
  options,
  onError
}: {
  domain: string
  options?: Options
  onError?: (action: string, params: Record<string, any>) => (res: ResponseError) => Promise<void>
}): FaasReactClientInstance {
  const client = new FaasBrowserClient(domain, options)

  function faas<PathOrData extends FaasAction> (
    action: PathOrData | string,
    params: FaasParams<PathOrData>
  ): Response<FaasData<PathOrData>> {
    const { data } = useSWR([action, params], client.action, {
      onError: (err) => {
        if (onError)onError(action as string, params)(err)
      }
    })
    return data as Response
  }

  function useFaas<PathOrData extends FaasAction> (
    action: PathOrData | string,
    defaultParams: FaasParams<PathOrData>,
    options?: {
      data?: FaasData<PathOrData>
    }
  ): FaasDataInjection<FaasData<PathOrData>> {
    if (!options) options = {}
    const { mutate } = useSWRConfig()
    const { data, error } = useSWR([action, defaultParams], client.action, {
      onError: (err) => {
        onError(action as string, defaultParams)(err)
      }
    })
    return {
      action,
      params: defaultParams,
      loading: !data,
      data: options?.data || data as FaasData<PathOrData>,
      error,
      async reload (params?: any) {
        return mutate([action, defaultParams], params, false)
      },
    }
  }
  const reactClient = {
    faas,
    useFaas,
    FaasDataWrapper<PathOrData extends FaasAction> ({
      action, params,
      fallback, render,
      onDataChange,
      data
    }: FaasDataWrapperProps<PathOrData>): JSX.Element {
      const request = useFaas<PathOrData>(action, params, { data, })
      useEffect(function () {
        if (onDataChange) onDataChange(request)
      }, [JSON.stringify(request.data)])
      if (!request.data) return render(request) as JSX.Element

      return fallback || null
    }
  }

  clients[domain] = reactClient

  return reactClient
}

/**
 * Get FaasReactClient instance
 * @param domain {string} empty string for default domain
 * @returns {FaasReactClientInstance}
 *
 * ```ts
 * getClient()
 * // or
 * getClient('another-domain')
 * ```
 */
export function getClient (domain?: string): FaasReactClientInstance {
  const client = clients[domain || Object.keys(clients)[0]]

  if (!client) throw Error('FaasReactClient is not initialized')

  return client
}

/**
 * Request faas server
 *
 * @param action {string} action name
 * @param params {object} action params
 * @returns {Promise<Response<any>>}
 *
 * ```ts
 * faas<{ title: string }>('post/get', { id: 1 }).then(res => {
 *   console.log(res.data.title)
 * })
 * ```
 */
export async function faas<PathOrData extends FaasAction> (
  action: string | PathOrData,
  params: FaasParams<PathOrData>,
): Promise<Response<FaasData<PathOrData>>> {
  return getClient().faas(action, params)
}

/**
 * Request faas server with React hook
 * @param action {string} action name
 * @param defaultParams {object} initial action params
 * @returns {FaasDataInjection<any>}
 *
 * ```ts
 * function Post ({ id }) {
 *   const { data } = useFaas<{ title: string }>('post/get', { id })
 *   return <h1>{data.title}</h1>
 * }
 * ```
 */
export function useFaas<PathOrData extends FaasAction> (
  action: string | PathOrData,
  defaultParams: FaasParams<PathOrData>
): FaasDataInjection<FaasData<PathOrData>> {
  return getClient().useFaas(action, defaultParams)
}

/**
 * A data wrapper for react components
 * @returns {JSX.Element}
 *
 * ```ts
 * <FaasDataWrapper<{
 *   id: string
 *   title: string
 * }>
 *   action='post/get'
 *   params={ { id: 1 } }
 *   render={ ({ data }) => <h1>{ data.title }</h1> }
 * />
 * ```
 */
export function FaasDataWrapper<PathOrData extends FaasAction> (props: FaasDataWrapperProps<PathOrData>): JSX.Element {
  const [client, setClient] = useState<FaasReactClientInstance>()

  useEffect(() => {
    if (client) return

    setClient(getClient())
  }, [])

  if (!client)
    return props.fallback || null

  return createElement(client.FaasDataWrapper, props as any)
}
