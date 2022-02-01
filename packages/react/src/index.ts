import {
  FaasBrowserClient, Options, Response, ResponseError
} from '@faasjs/browser'

import {
  FaasAction, FaasData, FaasParams
} from '@faasjs/types'

import { useState, useEffect } from 'react'

export type {
  FaasBrowserClient, Options, Response, ResponseHeaders, ResponseError
} from '@faasjs/browser'

export type FaasDataInjection<Data = any> = {
  action: string | any
  params: Record<string, any>
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

export type FaasDataProps<PathOrData extends FaasAction> = {
  render?(args: FaasDataInjection<FaasData<PathOrData>>): JSX.Element
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
  ) => Promise<Response<FaasData<PathOrData>>>
  useFaas: <PathOrData extends FaasAction>(
    action: string | PathOrData,
    defaultParams: FaasParams<PathOrData>
  ) => FaasDataInjection<FaasData<PathOrData>>
  FaasData<PathOrData extends FaasAction>(props: FaasDataProps<PathOrData>): JSX.Element
}

const clients: {
  [key: string]: FaasReactClientInstance
} = {}

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
      data?: FaasData<PathOrData>
      setData?: React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>
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
      setLoading(true)
      const request = client.action<PathOrData>(action, params)
      setPromise(request)
      request
        .then(r => (options?.setData ? options.setData(r.data) : setData(r.data)))
        .catch(async e => {
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

      return () => setLoading(false)
    }, [
      action,
      JSON.stringify(params),
      reloadTimes
    ])

    return {
      action,
      params,
      loading,
      data: options?.data || data,
      error,
      promise,
      async reload (params?: any) {
        if (params) setParams(params)
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
    FaasData<PathOrData extends FaasAction> ({
      action, params,
      fallback, render,
      onDataChange,
      data,
      setData,
    }: FaasDataProps<PathOrData>): JSX.Element {
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

      if (loaded) return render(request)

      return fallback || null
    }
  }

  clients[domain] = reactClient

  return reactClient
}

export function getClient (domain?: string) {
  const client = clients[domain || Object.keys(clients)[0]]

  if (!client) throw Error('FaasReactClient is not initialized')

  return client
}
