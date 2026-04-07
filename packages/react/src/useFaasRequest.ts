import { useRef, useState } from 'react'

import type { BaseUrl } from './browser'
import { getClient, type FaasReactClientInstance } from './client'
import { equal, useEqualCallback, useEqualEffect } from './equal'

export type SharedUseFaasOptions<Params, Data> = {
  params?: Params
  data?: Data
  setData?: React.Dispatch<React.SetStateAction<Data>>
  skip?: boolean | ((params: Params) => boolean)
  debounce?: number
  baseUrl?: BaseUrl
}

type UseFaasRequestArgs<Params, Result, RequestPromise> = {
  action: string
  defaultParams: Params
  options: Pick<SharedUseFaasOptions<Params, Result>, 'params' | 'skip' | 'debounce' | 'baseUrl'>
  beforeSend?: () => void
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

export function useFaasRequest<Params, Result, RequestPromise = Promise<Result>>({
  action,
  defaultParams,
  options,
  beforeSend,
  onSuccess,
  send,
}: UseFaasRequestArgs<Params, Result, RequestPromise>) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>()
  const [params, setParams] = useState(defaultParams)
  const [reloadTimes, setReloadTimes] = useState(0)
  const [skip, setSkip] = useState(
    typeof options.skip === 'function' ? options.skip(defaultParams) : options.skip,
  )
  const promiseRef = useRef<RequestPromise | null>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const failedOnceRef = useRef(false)
  const pendingReloadsRef = useRef<Map<number, PendingReload<Result>>>(new Map())
  const reloadCounterRef = useRef(0)
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
      return
    }

    setLoading(true)
    beforeSendRef.current?.()
    failedOnceRef.current = false

    const controller = new AbortController()
    controllerRef.current = controller

    const client = getClient(options.baseUrl)
    const requestParams = options.params || params

    const rejectPending = (reason: any) => {
      for (const { reject } of pendingReloadsRef.current.values()) reject(reason)

      pendingReloadsRef.current.clear()
    }

    const resolvePending = (value: Result) => {
      for (const { resolve } of pendingReloadsRef.current.values()) resolve(value)

      pendingReloadsRef.current.clear()
    }

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
          failedOnceRef.current = false
          setError(null)
          onSuccessRef.current?.(result)
          setLoading(false)
          resolvePending(result)
        })
        .catch(async (e) => {
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

          setError(nextError)
          setLoading(false)
          rejectPending(nextError)
        })
    }

    if (options.debounce) {
      const timeout = setTimeout(run, options.debounce)

      return () => {
        clearTimeout(timeout)
        controllerRef.current?.abort()
        setLoading(false)
      }
    }

    run()

    return () => {
      controllerRef.current?.abort()
      setLoading(false)
    }
  }, [action, options.params || params, reloadTimes, skip])

  const reload = useEqualCallback(
    (nextParams?: Params) => {
      if (skip) setSkip(false)
      if (nextParams) setParams(nextParams)

      const reloadCounter = ++reloadCounterRef.current

      return new Promise<Result>((resolve, reject) => {
        pendingReloadsRef.current.set(reloadCounter, { resolve, reject })
        setReloadTimes((prev) => prev + 1)
      })
    },
    [skip],
  )

  return {
    loading,
    error,
    params,
    reloadTimes,
    reload,
    promiseRef,
    setError,
    setLoading,
  }
}
