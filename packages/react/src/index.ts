import {
  FaasBrowserClient, Options, Params, Response, ResponseError
} from '../../browser/src'

import React, { useEffect } from 'react'

export type {
  FaasBrowserClient, Options, Params, Response, ResponseHeaders, ResponseError
} from '../../browser/src'

type FaasDataInjection<T = any> = {
  loading: boolean
  data: T
  error: any
  promise: Promise<Response<T>>
  reload(params?: Params): Promise<Response<T>>,
  setData(data: T): void
  setLoading(loading: boolean): void
  setPromise(promise: Promise<Response<T>>): void
  setError(error: any): void
}

type FaasDataProps<T = any> = {
  element(args: FaasDataInjection<T>): JSX.Element
  fallback?: JSX.Element | false
  action: string
  params?: Params
  onDataChange?(args: FaasDataInjection<T>): void
}

export function FaasReactClient ({
  domain,
  options,
  onError
}: {
  domain: string
  options?: Options
  onError?: (action: string, params: Params) => (res: ResponseError) => Promise<any>
}) {
  const client = new FaasBrowserClient(domain, options)

  const useFaas = function<T = any> (action: string, defaultParams: Params): FaasDataInjection<T> {
    const [loading, setLoading] = React.useState(true)
    const [data, setData] = React.useState<T>()
    const [error, setError] = React.useState<any>()
    const [promise, setPromise] = React.useState<Promise<Response<T>>>()
    const [params, setParams] = React.useState(defaultParams)
    const [reloadTimes, setReloadTimes] = React.useState(0)

    React.useEffect(function () {
      if (JSON.stringify(defaultParams) !== JSON.stringify(params)) {
        setParams(defaultParams)
      }
    }, [JSON.stringify(defaultParams)])

    React.useEffect(function () {
      setLoading(true)
      const request = client.action<T>(action, params)
      setPromise(request)
      request
        .then(r => {
          setData(r?.data)
        })
        .catch(async e => {
          if (onError)
            try {
              setData(await onError(action, params)(e))
            } catch (error) {
              setError(error)
            }
          setError(e)
        })
        .finally(() => setLoading(false))

      return () => {
        setLoading(false)
      }
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
    async faas<T = any> (action: string, params: Params): Promise<Response<T>> {
      if (onError) return client.action<T>(action, params).catch(onError(action, params))
      return client.action<T>(action, params)
    },
    useFaas,
    FaasData<T = any> ({
      action, params, fallback, element, onDataChange
    }: FaasDataProps<T>): JSX.Element {
      const request = useFaas(action, params)
      const [loaded, setLoaded] = React.useState(false)

      useEffect(function () {
        if (!loaded && !request.loading) setLoaded(true)
      }, [request.loading])

      useEffect(() => {
        if (onDataChange) onDataChange(request)
      }, [JSON.stringify(request.data)])

      if (loaded) return element(request)

      return fallback || null
    }
  }
}
