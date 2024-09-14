import type { FaasAction, FaasData, FaasParams } from '@faasjs/types'
import { useState, useEffect, useCallback } from 'react'
import type { FaasDataInjection, useFaasOptions } from './types'
import type { Response } from '@faasjs/browser'
import { getClient } from './client'

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

  const client = getClient(options.baseUrl)

  useEffect(() => {
    setSkip(
      typeof options.skip === 'function' ? options.skip(params) : options.skip
    )
  }, [
    typeof options.skip === 'function' ? JSON.stringify(params) : options.skip,
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
      const request = client.faas<PathOrData>(
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

          if (client.onError)
            try {
              await client.onError(action as string, params)(e)
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
