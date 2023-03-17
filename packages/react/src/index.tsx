import {
  FaasBrowserClient, Options, Response, ResponseHeaders, ResponseError
} from '@faasjs/browser'

import type {
  FaasAction, FaasData, FaasParams
} from '@faasjs/types'

import {
  useState, useEffect, createElement, cloneElement,
} from 'react'

export type {
  FaasBrowserClient,
  Options, Response, ResponseHeaders, ResponseError,
  FaasAction, FaasData, FaasParams
}

/**
 * Injects FaasData props.
 */
export interface FaasDataInjection<Data = any> {
  action: string | any
  params: Record<string, any>
  setParams: React.Dispatch<React.SetStateAction<any>>
  loading: boolean
  data: Data
  error: any
  promise: Promise<Response<Data>>
  reload(params?: Record<string, any>): Promise<Response<Data>>,
  setData: React.Dispatch<React.SetStateAction<Data>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setPromise: React.Dispatch<React.SetStateAction<Promise<Response<Data>>>>
  setError: React.Dispatch<React.SetStateAction<any>>
}

export interface FaasDataWrapperProps<PathOrData extends FaasAction> {
  render?(args: FaasDataInjection<FaasData<PathOrData>>): JSX.Element | JSX.Element[]
  children?: React.ReactElement<Partial<FaasDataInjection>>
  fallback?: JSX.Element | false
  action: string
  params?: FaasParams<PathOrData>
  setParams?: React.Dispatch<React.SetStateAction<FaasParams<PathOrData>>>
  onDataChange?(args: FaasDataInjection<FaasData<PathOrData>>): void
  /** use custom data, should work with setData */
  data?: FaasData<PathOrData>
  /** use custom setData, should work with data */
  setData?: React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>
}

export interface FaasReactClientInstance {
  faas: <PathOrData extends FaasAction>(
    action: string | PathOrData,
    params: FaasParams<PathOrData>
  ) => Promise<Response<FaasData<PathOrData>>>
  useFaas: <PathOrData extends FaasAction>(
    action: string | PathOrData,
    defaultParams: FaasParams<PathOrData>,
    options?: {
      data?: FaasData<PathOrData>
      setData?: React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>
      skip?: boolean
    }
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

  async function faas<PathOrData extends FaasAction> (
    action: PathOrData | string,
    params: FaasParams<PathOrData>
  ): Promise<Response<FaasData<PathOrData>>> {
    if (onError)
      return client.action<PathOrData>(action, params)
        .catch(async res => {
          await onError(action as string, params)(res)
          return Promise.reject(res)
        })
    return client.action(action, params)
  }

  function useFaas<PathOrData extends FaasAction> (
    action: PathOrData | string,
    defaultParams: FaasParams<PathOrData>,
    options?: {
      params?: FaasParams<PathOrData>
      setParams?: React.Dispatch<React.SetStateAction<FaasParams<PathOrData>>>
      data?: FaasData<PathOrData>
      setData?: React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>
      skip?: boolean
    }
  ): FaasDataInjection<FaasData<PathOrData>> {
    if (!options) options = {}

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<FaasData<PathOrData>>()
    const [error, setError] = useState<any>()
    const [promise, setPromise] = useState<Promise<Response<FaasData<PathOrData>>>>()
    const [params, setParams] = useState(defaultParams)
    const [reloadTimes, setReloadTimes] = useState(0)

    useEffect(function () {
      if (JSON.stringify(defaultParams) !== JSON.stringify(params)) {
        setParams(defaultParams)
      }
    }, [JSON.stringify(defaultParams)])

    useEffect(function () {
      if (options?.skip) {
        setLoading(false)
        return
      }

      setLoading(true)

      const controller = new AbortController()
      const request = client.action<PathOrData>(action, options.params || params, { signal: controller.signal })
      setPromise(request)

      request
        .then(r => (options?.setData ? options.setData(r.data) : setData(r.data)))
        .catch(async e => {
          if (e?.message === 'The user aborted a request.') return

          if (onError)
            try {
              await onError(action as string, params)(e)
            } catch (error) {
              setError(error)
            }
          else
            setError(e)
          return Promise.reject(e)
        })
        .finally(() => setLoading(false))

      return () => {
        controller.abort()
        setLoading(false)
      }
    }, [
      action,
      JSON.stringify(options.params || params),
      reloadTimes,
      options.skip,
    ])

    return {
      action,
      params,
      setParams,
      loading,
      data: options?.data || data,
      error,
      promise,
      async reload (params?: any) {
        if (params) {
          options.setParams ? options.setParams(params) : setParams(params)
        }

        setReloadTimes(reloadTimes + 1)

        return promise
      },
      setData: options?.setData || setData,
      setLoading,
      setPromise,
      setError,
    }
  }

  const reactClient = {
    faas,
    useFaas,
    FaasDataWrapper<PathOrData extends FaasAction> ({
      action, params,
      fallback, render, children,
      onDataChange,
      data,
      setData,
    }: FaasDataWrapperProps<PathOrData>): JSX.Element {
      const request = useFaas<PathOrData>(action, params, {
        data,
        setData
      })
      const [loaded, setLoaded] = useState<boolean>(false)

      useEffect(function () {
        if (!loaded && !request.loading) setLoaded(true)
      }, [request.loading])

      useEffect(function () {
        if (onDataChange) onDataChange(request)
      }, [JSON.stringify(request.data)])

      if (loaded) {
        if (children) return cloneElement(children, request)
        if (render) return render(request) as JSX.Element
      }

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
  defaultParams: FaasParams<PathOrData>,
  options?: {
    data?: FaasData<PathOrData>
    setData?: React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>
    skip?: boolean
  }
): FaasDataInjection<FaasData<PathOrData>> {
  return getClient().useFaas(action, defaultParams, options)
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
