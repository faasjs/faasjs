import type {
  FaasDataInjection,
  FaasDataWrapperProps,
  FaasReactClientInstance,
  useFaasOptions,
} from './types'
import type { FaasAction, FaasData, FaasParams } from '@faasjs/types'
import type { Options, Response, ResponseError } from '@faasjs/browser'
import { cloneElement, useCallback, useEffect, useMemo, useState } from 'react'
import { FaasBrowserClient } from '@faasjs/browser'

const clients: {
  [key: string]: FaasReactClientInstance
} = {}

export type FaasReactClientOptions = {
  domain: string
  options?: Options
  onError?: (
    action: string,
    params: Record<string, any>
  ) => (res: ResponseError) => Promise<void>
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
    params: FaasParams<PathOrData>
  ): Promise<Response<FaasData<PathOrData>>> {
    if (onError)
      return client.action<PathOrData>(action, params).catch(async res => {
        await onError(action as string, params)(res)
        return Promise.reject(res)
      })
    return client.action(action, params)
  }

  function useFaas<PathOrData extends FaasAction>(
    action: PathOrData | string,
    defaultParams: FaasParams<PathOrData>,
    options?: useFaasOptions<PathOrData>
  ): FaasDataInjection<FaasData<PathOrData>> {
    if (!options) options = {}

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<FaasData<PathOrData>>()
    const [error, setError] = useState<any>()
    const [promise, setPromise] =
      useState<Promise<Response<FaasData<PathOrData>>>>()
    const [params, setParams] = useState(defaultParams)
    const [reloadTimes, setReloadTimes] = useState(0)
    const [fails, setFails] = useState(0)
    const [skip, setSkip] = useState(
      typeof options.skip === 'function'
        ? options.skip(defaultParams)
        : options.skip
    )

    useEffect(() => {
      setSkip(
        typeof options.skip === 'function' ? options.skip(params) : options.skip
      )
    }, [
      typeof options.skip === 'function'
        ? JSON.stringify(params)
        : options.skip,
    ])

    useEffect(() => {
      if (JSON.stringify(defaultParams) !== JSON.stringify(params)) {
        setParams(defaultParams)
      }
    }, [JSON.stringify(defaultParams)])

    useEffect(() => {
      if (!action || skip) {
        setLoading(false)
        return
      }

      setLoading(true)

      const controller = new AbortController()

      function send() {
        const request = client.action<PathOrData>(
          action,
          options.params || params,
          { signal: controller.signal }
        )
        setPromise(request)

        request
          .then(r => {
            options?.setData ? options.setData(r.data) : setData(r.data)
            setLoading(false)
          })
          .catch(async e => {
            if (
              typeof e?.message === 'string' &&
              (e.message as string).toLowerCase().indexOf('aborted') >= 0
            )
              return

            if (
              !fails &&
              typeof e?.message === 'string' &&
              e.message.indexOf('Failed to fetch') >= 0
            ) {
              console.warn(`FaasReactClient: ${e.message} retry...`)
              setFails(1)
              return send()
            }

            if (onError)
              try {
                await onError(action as string, params)(e)
              } catch (error) {
                setError(error)
              }
            else setError(e)
            setLoading(false)
            return Promise.reject(e)
          })
      }

      if (options?.debounce) {
        const timeout = setTimeout(send, options.debounce)

        return () => {
          clearTimeout(timeout)
          controller.abort()
          setLoading(false)
        }
      }

      send()

      return () => {
        controller.abort()
        setLoading(false)
      }
    }, [action, JSON.stringify(options.params || params), reloadTimes, skip])

    const reload = useCallback(
      (params?: FaasParams<PathOrData>) => {
        if (params) setParams(params)

        setReloadTimes(prev => prev + 1)

        return promise
      },
      [params]
    )

    return {
      action,
      params,
      loading,
      data: options?.data || data,
      reloadTimes,
      error,
      promise,
      reload,
      setData: options?.setData || setData,
      setLoading,
      setPromise,
      setError,
    }
  }

  useFaas.whyDidYouRender = true

  function FaasDataWrapper<PathOrData extends FaasAction>({
    action,
    params,
    fallback,
    render,
    children,
    onDataChange,
    data,
    setData,
  }: FaasDataWrapperProps<PathOrData>): JSX.Element {
    const request = useFaas<PathOrData>(action, params, {
      data,
      setData,
    })
    const [loaded, setLoaded] = useState<boolean>(false)

    useEffect(() => {
      if (!loaded && !request.loading) setLoaded(true)
    }, [request.loading])

    useEffect(() => {
      if (onDataChange) onDataChange(request)
    }, [JSON.stringify(request.data)])

    const child = useMemo(() => {
      if (loaded) {
        if (children) return cloneElement(children, request)
        if (render) return render(request) as JSX.Element
      }

      return fallback || null
    }, [
      loaded,
      request.action,
      request.params,
      request.data,
      request.error,
      request.loading,
    ])

    return child
  }

  FaasDataWrapper.whyDidYouRender = true

  const reactClient = {
    id: client.id,
    faas,
    useFaas,
    FaasDataWrapper,
  }

  clients[domain] = reactClient

  return reactClient
}

/**
 * Get FaasReactClient instance
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
      domain: '',
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

/**
 * Request faas server with React hook
 *
 * @param action {string} action name
 * @param defaultParams {object} initial action params
 * @returns {FaasDataInjection<any>}
 *
 * @example
 * ```tsx
 * function Post ({ id }) {
 *   const { data } = useFaas<{ title: string }>('post/get', { id })
 *   return <h1>{data.title}</h1>
 * }
 * ```
 */
export function useFaas<PathOrData extends FaasAction>(
  action: string | PathOrData,
  defaultParams: FaasParams<PathOrData>,
  options?: useFaasOptions<PathOrData>
): FaasDataInjection<FaasData<PathOrData>> {
  return getClient().useFaas(action, defaultParams, options)
}

/**
 * A data wrapper for react components
 *
 * @returns {JSX.Element}
 *
 * @example
 * ```tsx
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
export function FaasDataWrapper<PathOrData extends FaasAction>(
  props: FaasDataWrapperProps<PathOrData>
): JSX.Element {
  const [client, setClient] = useState<FaasReactClientInstance>()

  useEffect(() => {
    if (client) return

    setClient(getClient())
  }, [])

  if (!client) return props.fallback || null

  return <client.FaasDataWrapper {...props} />
}

FaasDataWrapper.whyDidYouRender = true
