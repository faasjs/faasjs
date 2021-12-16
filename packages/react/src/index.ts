import {
  FaasBrowserClient, Options, Params, Response, ResponseError
} from '@faasjs/browser'

import { useState, useEffect } from 'react'

export type {
  FaasBrowserClient, Options, Params, Response, ResponseHeaders, ResponseError
} from '@faasjs/browser'

type FaasDataInjection<T = any> = {
  loading: boolean
  data: T
  error: any
  promise: Promise<Response<T>>
  reload(params?: Params): Promise<Response<T>>,
  setData: React.Dispatch<React.SetStateAction<T>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setPromise: React.Dispatch<React.SetStateAction<Promise<Response<T>>>>
  setError: React.Dispatch<React.SetStateAction<any>>
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

  // async function faas<Path extends keyof FaasActions> (action: Path, params: FaasActions[Path]['request']): Promise<Response<FaasActions[Path]['response']>>
  async function faas<T = any> (action: string, params: Params): Promise<Response<T>> {
    if (onError)
      return client.action(action, params)
        .catch(onError(action, params))
    return client.action(action, params)
  }

  function useFaas <T = any> (action: string, defaultParams: Params): FaasDataInjection<T> {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<T>()
    const [error, setError] = useState<any>()
    const [promise, setPromise] = useState<Promise<Response<T>>>()
    const [params, setParams] = useState(defaultParams)
    const [reloadTimes, setReloadTimes] = useState(0)

    useEffect(function () {
      if (JSON.stringify(defaultParams) !== JSON.stringify(params)) {
        setParams(defaultParams)
      }
    }, [JSON.stringify(defaultParams)])

    useEffect(function () {
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
    faas,
    useFaas,
    FaasData<T = any> ({
      action, params, fallback, element, onDataChange
    }: FaasDataProps<T>): JSX.Element {
      const request = useFaas(action, params)
      const [loaded, setLoaded] = useState(false)

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
