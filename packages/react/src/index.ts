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

type FaasDataInjection<Data = any> = {
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

type FaasDataProps<PathOrData extends FaasAction> = {
  element(args: FaasDataInjection<FaasData<PathOrData>>): JSX.Element
  fallback?: JSX.Element | false
  action: string
  params?: FaasParams<PathOrData>
  onDataChange?(args: FaasDataInjection<FaasData<PathOrData>>): void
}

export function FaasReactClient ({
  domain,
  options,
  onError
}: {
  domain: string
  options?: Options
  onError?: (action: string, params: Record<string, any>) => (res: ResponseError) => Promise<void>
}): {
  faas: <PathOrData extends FaasAction>(
    action: string | PathOrData,
    params: FaasParams<PathOrData>
  ) => Promise<Response<FaasData<PathOrData>>>
  useFaas: <PathOrData extends FaasAction>(
    action: string | PathOrData,
    defaultParams: FaasParams<PathOrData>
  ) => FaasDataInjection<FaasData<PathOrData>>
  FaasData<PathOrData extends FaasAction>(props: FaasDataProps<PathOrData>): JSX.Element
} {
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
    defaultParams: FaasParams<PathOrData>
  ): FaasDataInjection<FaasData<PathOrData>> {
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
        .then(r => setData(r.data))
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
      loading,
      data,
      error,
      promise,
      async reload (params?: any) {
        if (params) setParams(params)
        setReloadTimes(reloadTimes + 1)
        return promise
      },
      setData,
      setLoading,
      setPromise,
      setError,
    }
  }

  return {
    faas,
    useFaas,
    FaasData<PathOrData extends FaasAction> ({
      action, params, fallback, element, onDataChange
    }: FaasDataProps<PathOrData>): JSX.Element {
      const request = useFaas<PathOrData>(action, params)
      const [loaded, setLoaded] = useState<boolean>(false)

      useEffect(function () {
        if (!loaded && !request.loading) setLoaded(true)
      }, [request.loading])

      useEffect(function () {
        if (onDataChange) onDataChange(request)
      }, [JSON.stringify(request.data)])

      if (loaded) return element(request)

      return fallback || null
    }
  }
}
