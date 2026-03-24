import type { FaasAction, FaasActionUnionType, FaasData, FaasParams } from '@faasjs/types'
import { useRef, useState } from 'react'

import type { BaseUrl, Response } from './browser'
import { getClient } from './client'
import { equal, useEqualCallback, useEqualEffect } from './equal'
import type { FaasDataInjection } from './FaasDataWrapper'

/**
 * Options for {@link useFaas}.
 */
export type useFaasOptions<PathOrData extends FaasActionUnionType> = {
  /** Override the request params without changing the hook's stored params state. */
  params?: FaasParams<PathOrData>
  /** Controlled data value used instead of the hook's internal state. */
  data?: FaasData<PathOrData>
  /** Controlled setter that is called instead of the hook's internal `setData`. */
  setData?: React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>
  /**
   * If skip is true, the request will not be sent.
   *
   * However, you can still use reload to send the request.
   */
  skip?: boolean | ((params: FaasParams<PathOrData>) => boolean)
  /** Send the last request after milliseconds */
  debounce?: number
  /** Override the default base URL for this hook instance. */
  baseUrl?: BaseUrl
}

/**
 * Request FaasJS data and keep request state in React state.
 *
 * `useFaas` sends an initial request unless `skip` is enabled, and returns
 * request state plus helpers for reloading, updating data, and handling errors.
 *
 * @param action - Action path to invoke.
 * @param defaultParams - Params used for the initial request and future reloads.
 * @param options - Optional hook configuration such as controlled data, debounce, and skip logic.
 * @returns Request state and helper methods for the action.
 *
 * @example
 * ```tsx
 * import { useFaas } from '@faasjs/react'
 *
 * function Post({ id }: { id: number }) {
 *   const { data } = useFaas<{ title: string }>('post/get', { id })
 *
 *   return <h1>{data.title}</h1>
 * }
 * ```
 */
export function useFaas<PathOrData extends FaasActionUnionType>(
  action: FaasAction<PathOrData>,
  defaultParams: FaasParams<PathOrData>,
  options: useFaasOptions<PathOrData> = {},
): FaasDataInjection<PathOrData> {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<FaasData<PathOrData>>()
  const [error, setError] = useState<any>()
  const [params, setParams] = useState(defaultParams)
  const [reloadTimes, setReloadTimes] = useState(0)
  const [fails, setFails] = useState(0)
  const [skip, setSkip] = useState(
    typeof options.skip === 'function' ? options.skip(defaultParams) : options.skip,
  )
  const promiseRef = useRef<Promise<Response<FaasData<PathOrData>>> | null>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const localSetData = setData as React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>
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
    setSkip(typeof options.skip === 'function' ? options.skip(params) : options.skip)
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

    const controller = new AbortController()
    controllerRef.current = controller

    const client = getClient(options.baseUrl)
    const requestParams = options.params ?? params

    function send() {
      const request = client.faas<PathOrData>(action, requestParams, {
        signal: controller.signal,
      })
      promiseRef.current = request

      request
        .then((r) => {
          const nextData = r.data as FaasData<PathOrData>

          setFails(0)
          setError(null)
          if (options.setData) options.setData(nextData)
          else localSetData(nextData)
          setLoading(false)

          for (const { resolve } of pendingReloadsRef.current.values()) resolve(nextData)

          pendingReloadsRef.current.clear()
        })
        .catch(async (e) => {
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
              await client.onError(action as string, requestParams)(e)
            } catch (newError) {
              error = newError
            }

          setError(error)
          setLoading(false)

          for (const { reject } of pendingReloadsRef.current.values()) reject(error)

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

      setReloadTimes((prev) => prev + 1)

      return new Promise<FaasData<PathOrData>>((resolve, reject) => {
        pendingReloadsRef.current.set(reloadCounter, { resolve, reject })
        setReloadTimes((prev) => prev + 1)
      })
    },
    [params, skip],
  )

  const currentData = (options.data ?? data) as FaasData<PathOrData>
  const currentPromise = promiseRef.current ?? Promise.resolve({} as Response<FaasData<PathOrData>>)
  const updateData = (options.setData ?? localSetData) as React.Dispatch<
    React.SetStateAction<FaasData<PathOrData>>
  >

  return {
    action,
    params,
    loading,
    data: currentData,
    reloadTimes,
    error,
    promise: currentPromise,
    reload,
    setData: updateData,
    setLoading,
    setPromise: (newPromise) => {
      promiseRef.current =
        typeof newPromise === 'function' ? newPromise(currentPromise) : newPromise
    },
    setError,
  }
}
