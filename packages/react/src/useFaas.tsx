import type { BaseUrl, Response } from '@faasjs/browser'
import type {
  FaasAction,
  FaasActionUnionType,
  FaasData,
  FaasParams,
} from '@faasjs/types'
import { useRef, useState } from 'react'
import type { FaasDataInjection } from './FaasDataWrapper'
import { getClient } from './client'
import { equal, useEqualCallback, useEqualEffect } from './equal'

export type useFaasOptions<PathOrData extends FaasAction> = {
  params?: FaasParams<PathOrData>
  data?: FaasData<PathOrData>
  setData?: React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>
  /**
   * If skip is true, the request will not be sent.
   *
   * However, you can still use reload to send the request.
   */
  skip?: boolean | ((params: FaasParams<PathOrData>) => boolean)
  /** Send the last request after milliseconds */
  debounce?: number
  baseUrl?: BaseUrl
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
export function useFaas<PathOrData extends FaasActionUnionType>(
  action: FaasAction<PathOrData>,
  defaultParams: FaasParams<PathOrData>,
  options: useFaasOptions<PathOrData> = {}
): FaasDataInjection<PathOrData> {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<FaasData<PathOrData>>()
  const [error, setError] = useState<any>()
  const [params, setParams] = useState(defaultParams)
  const [reloadTimes, setReloadTimes] = useState(0)
  const [fails, setFails] = useState(0)
  const [skip, setSkip] = useState(
    typeof options.skip === 'function'
      ? options.skip(defaultParams)
      : options.skip
  )
  const promiseRef = useRef<Promise<Response<FaasData<PathOrData>>>>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const pendingReloadsRef = useRef<
    Map<
      number,
      {
        resolve: (value: FaasData<PathOrData>) => void
        reject: (reason: any) => void
      }
    >
  >(new Map())
  const reloadCounterRef = useRef(0)

  useEqualEffect(() => {
    setSkip(
      typeof options.skip === 'function' ? options.skip(params) : options.skip
    )
  }, [typeof options.skip === 'function' ? params : options.skip])

  useEqualEffect(() => {
    if (!equal(defaultParams, params)) {
      setParams(defaultParams)
    }
  }, [defaultParams])

  useEqualEffect(() => {
    if (!action || skip) {
      setLoading(false)
      return
    }

    setLoading(true)

    controllerRef.current = new AbortController()

    const client = getClient(options.baseUrl)

    function send() {
      const request = client.faas<PathOrData>(
        action,
        options.params || params,
        { signal: controllerRef.current.signal }
      )
      promiseRef.current = request

      request
        .then(r => {
          options.setData ? options.setData(r.data) : setData(r.data)
          setLoading(false)

          for (const { resolve } of pendingReloadsRef.current.values())
            resolve(r.data)

          pendingReloadsRef.current.clear()
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

          let error = e
          if (client.onError)
            try {
              await client.onError(action as string, params)(e)
            } catch (newError) {
              error = newError
            }

          setError(error)
          setLoading(false)

          for (const { reject } of pendingReloadsRef.current.values())
            reject(error)

          pendingReloadsRef.current.clear()

          return
        })
    }

    if (options.debounce) {
      const timeout = setTimeout(send, options.debounce)

      return () => {
        clearTimeout(timeout)
        controllerRef.current?.abort()
        setLoading(false)
      }
    }

    send()

    return () => {
      controllerRef.current?.abort()
      setLoading(false)
    }
  }, [action, options.params || params, reloadTimes, skip])

  const reload = useEqualCallback(
    (params?: FaasParams<PathOrData>) => {
      if (skip) setSkip(false)
      if (params) setParams(params)

      const reloadCounter = ++reloadCounterRef.current

      setReloadTimes(prev => prev + 1)

      return new Promise<Response<FaasData<PathOrData>>>((resolve, reject) => {
        pendingReloadsRef.current.set(reloadCounter, { resolve, reject })
        setReloadTimes(prev => prev + 1)
      })
    },
    [params, skip]
  )

  return {
    action,
    params,
    loading,
    data: options.data || data,
    reloadTimes,
    error,
    promise: promiseRef.current,
    reload,
    setData: options.setData || setData,
    setLoading,
    setPromise: newPromise =>
      typeof newPromise === 'function'
        ? newPromise(promiseRef.current)
        : (promiseRef.current = newPromise),
    setError,
  }
}

useFaas.whyDidYouRender = true
