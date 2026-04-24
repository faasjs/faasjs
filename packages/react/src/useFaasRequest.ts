import { useRef, useState } from 'react'

import type { BaseUrl } from './browser'
import { getClient, type FaasReactClientInstance } from './client'
import { equal, useEqualCallback, useEqualEffect } from './equal'

/**
 * Shared request options consumed by `useFaas` and `useFaasStream`.
 *
 * @property {Params} [params] - Controlled params override sent with the request without mutating local params state.
 * @property {Data} [data] - Controlled data value used by higher-level hooks.
 * @property {React.Dispatch<React.SetStateAction<Data>>} [setData] - Controlled setter paired with `data`.
 * @property {boolean | ((params: Params) => boolean)} [skip] - Boolean or predicate that suppresses the automatic request.
 * @property {number} [debounce] - Milliseconds to wait before sending the latest request.
 * @property {number | false} [polling] - Milliseconds to wait after each completed request before refreshing data in the background.
 * @property {BaseUrl} [baseUrl] - Base URL override used for this request lifecycle.
 */
export type SharedUseFaasOptions<Params, Data> = {
  params?: Params
  data?: Data
  setData?: React.Dispatch<React.SetStateAction<Data>>
  skip?: boolean | ((params: Params) => boolean)
  debounce?: number
  polling?: number | false
  baseUrl?: BaseUrl
}

type UseFaasRequestArgs<Params, Result, RequestPromise> = {
  action: string
  defaultParams: Params
  options: Pick<
    SharedUseFaasOptions<Params, Result>,
    'params' | 'skip' | 'debounce' | 'polling' | 'baseUrl'
  >
  beforeSend?: (args: { silent: boolean }) => void
  onSuccess?: (result: Result) => void
  send: (args: {
    action: string
    params: Params
    signal: AbortSignal
    client: FaasReactClientInstance
    setPromise: (promise: RequestPromise) => void
  }) => Promise<Result>
}

type PendingReload<Result> = {
  resolve: (value: Result) => void
  reject: (reason: any) => void
}

type RequestTrigger = {
  times: number
  silent: boolean
}

/**
 * Run the shared request lifecycle used by the higher-level FaasJS React hooks.
 *
 * It manages loading state, background refresh state, abort signals, debounce timing,
 * retry-on-fetch-failure, polling, and queued reload promises while delegating the
 * actual transport to `send`.
 *
 * @template Params - Request params type tracked by the lifecycle.
 * @template Result - Successful response payload type.
 * @template RequestPromise - Promise type exposed through `promiseRef`.
 * @param {UseFaasRequestArgs<Params, Result, RequestPromise>} args - Request lifecycle configuration.
 * @param {string} args.action - Action path or request key used to trigger the lifecycle.
 * @param {Params} args.defaultParams - Initial params value stored by the lifecycle.
 * @param {Pick<SharedUseFaasOptions<Params, Result>, 'params' | 'skip' | 'debounce' | 'polling' | 'baseUrl'>} args.options - Shared request options used by the lifecycle.
 * @param {(args: { silent: boolean }) => void} [args.beforeSend] - Optional callback invoked immediately before a request starts.
 * @param {(result: Result) => void} [args.onSuccess] - Optional callback invoked after a successful response.
 * @param {UseFaasRequestArgs<Params, Result, RequestPromise>['send']} args.send - Transport function responsible for creating and resolving the request.
 * @returns Shared request state, reload helpers, and refs used by `useFaas` and `useFaasStream`.
 * @example
 * ```ts
 * function useUserRequest(id: number) {
 *   return useFaasRequest({
 *     action: '/pages/users/get',
 *     defaultParams: { id },
 *     options: {},
 *     send: async ({ action, params, signal, client, setPromise }) => {
 *       const promise = client.faas(action, params, { signal })
 *
 *       setPromise(promise)
 *
 *       return (await promise).data as { name: string }
 *     },
 *   })
 * }
 * ```
 */
export function useFaasRequest<Params, Result, RequestPromise = Promise<Result>>({
  action,
  defaultParams,
  options,
  beforeSend,
  onSuccess,
  send,
}: UseFaasRequestArgs<Params, Result, RequestPromise>) {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<any>()
  const [params, setParams] = useState(defaultParams)
  const [requestTrigger, setRequestTrigger] = useState<RequestTrigger>({ times: 0, silent: false })
  const [skip, setSkip] = useState(
    typeof options.skip === 'function' ? options.skip(defaultParams) : options.skip,
  )
  const promiseRef = useRef<RequestPromise | null>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const failedOnceRef = useRef(false)
  const pendingReloadsRef = useRef<Map<number, PendingReload<Result>>>(new Map())
  const reloadCounterRef = useRef(0)
  const requestVersionRef = useRef(0)
  const handledRequestTriggerTimesRef = useRef(-1)
  const pollingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasLoadedRef = useRef(false)
  const beforeSendRef = useRef(beforeSend)
  const onSuccessRef = useRef(onSuccess)
  const sendRef = useRef(send)

  beforeSendRef.current = beforeSend
  onSuccessRef.current = onSuccess
  sendRef.current = send

  useEqualEffect(() => {
    setSkip(typeof options.skip === 'function' ? options.skip(params) : options.skip)
  }, [typeof options.skip === 'function' ? params : options.skip])

  useEqualEffect(() => {
    if (!equal(defaultParams, params)) setParams(defaultParams)
  }, [defaultParams])

  useEqualEffect(() => {
    if (!action || skip) {
      setLoading(false)
      setRefreshing(false)
      return
    }

    const isRequestTriggerChange = requestTrigger.times !== handledRequestTriggerTimesRef.current
    const isSilentRequest = isRequestTriggerChange && requestTrigger.silent && hasLoadedRef.current
    handledRequestTriggerTimesRef.current = requestTrigger.times

    if (isSilentRequest) setRefreshing(true)
    else setLoading(true)

    beforeSendRef.current?.({ silent: isSilentRequest })
    failedOnceRef.current = false

    const controller = new AbortController()
    const requestVersion = ++requestVersionRef.current
    controllerRef.current = controller

    const client = getClient(options.baseUrl)
    const requestParams = options.params || params

    const clearPollingTimer = () => {
      if (!pollingTimerRef.current) return

      clearTimeout(pollingTimerRef.current)
      pollingTimerRef.current = null
    }

    const schedulePolling = () => {
      clearPollingTimer()

      if (!options.polling || options.polling <= 0 || !isCurrentRequest()) return

      pollingTimerRef.current = setTimeout(() => {
        if (!isCurrentRequest()) return

        setRequestTrigger((prev) => ({ times: prev.times + 1, silent: true }))
      }, options.polling)
    }

    const rejectPending = (reason: any) => {
      for (const { reject } of pendingReloadsRef.current.values()) reject(reason)

      pendingReloadsRef.current.clear()
    }

    const resolvePending = (value: Result) => {
      for (const { resolve } of pendingReloadsRef.current.values()) resolve(value)

      pendingReloadsRef.current.clear()
    }

    const isCurrentRequest = () =>
      requestVersion === requestVersionRef.current && controllerRef.current === controller

    const run = () => {
      void sendRef
        .current({
          action,
          params: requestParams,
          signal: controller.signal,
          client,
          setPromise: (promise) => {
            promiseRef.current = promise
          },
        })
        .then((result) => {
          if (!isCurrentRequest()) return

          failedOnceRef.current = false
          setError(null)
          onSuccessRef.current?.(result)
          hasLoadedRef.current = true
          setLoading(false)
          setRefreshing(false)
          resolvePending(result)
          schedulePolling()
        })
        .catch(async (e) => {
          if (!isCurrentRequest()) return

          if (
            typeof e?.message === 'string' &&
            (e.message as string).toLowerCase().includes('aborted')
          )
            return

          if (
            !failedOnceRef.current &&
            typeof e?.message === 'string' &&
            e.message.includes('Failed to fetch')
          ) {
            failedOnceRef.current = true
            console.warn(`FaasReactClient: ${e.message} retry...`)
            run()
            return
          }

          let nextError = e

          if (client.onError)
            try {
              await client.onError(
                action,
                (requestParams || Object.create(null)) as Record<string, any>,
              )(e)
            } catch (newError) {
              nextError = newError
            }

          if (!isCurrentRequest()) return

          setError(nextError)
          setLoading(false)
          setRefreshing(false)
          rejectPending(nextError)
          schedulePolling()
        })
    }

    if (options.debounce) {
      const timeout = setTimeout(run, options.debounce)

      return () => {
        clearTimeout(timeout)
        clearPollingTimer()
        if (controllerRef.current === controller) controllerRef.current = null
        controller.abort()
        setLoading(false)
        setRefreshing(false)
      }
    }

    run()

    return () => {
      clearPollingTimer()
      if (controllerRef.current === controller) controllerRef.current = null
      controller.abort()
      setLoading(false)
      setRefreshing(false)
    }
  }, [
    action,
    options.params || params,
    requestTrigger,
    skip,
    options.debounce,
    options.polling,
    options.baseUrl,
  ])

  const reload = useEqualCallback(
    (nextParams?: Params, reloadOptions?: { silent?: boolean }) => {
      if (skip) setSkip(false)
      if (nextParams) setParams(nextParams)

      const reloadCounter = ++reloadCounterRef.current

      return new Promise<Result>((resolve, reject) => {
        pendingReloadsRef.current.set(reloadCounter, { resolve, reject })
        setRequestTrigger((prev) => ({
          times: prev.times + 1,
          silent: Boolean(reloadOptions?.silent),
        }))
      })
    },
    [skip],
  )

  return {
    loading,
    refreshing,
    error,
    params,
    reloadTimes: requestTrigger.times,
    reload,
    promiseRef,
    setError,
    setLoading,
  }
}
