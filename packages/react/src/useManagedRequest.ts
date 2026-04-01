import type { Dispatch, SetStateAction } from 'react'
import { useRef, useState } from 'react'

import { equal, useEqualCallback, useEqualEffect } from './equal'
import { isAbortedRequestError, shouldRetryRequestError } from './requestHelpers'

type PendingReload<Data> = {
  resolve: (value: Data) => void
  reject: (reason: any) => void
}

type PromiseUpdater<RequestPromise> =
  | RequestPromise
  | ((currentPromise: RequestPromise) => RequestPromise)

type ManagedRequestOptions<Params, Data, RequestPromise> = {
  action: string
  defaultParams: Params
  params?: Params | undefined
  data?: Data | undefined
  setData?: Dispatch<SetStateAction<Data>> | undefined
  skip?: boolean | ((params: Params) => boolean) | undefined
  debounce?: number | undefined
  initialData: Data
  idlePromise: RequestPromise
  onRequestStart?: ((updateData: Dispatch<SetStateAction<Data>>) => void) | undefined
  execute: (args: {
    action: string
    params: Params
    signal: AbortSignal
    updateData: Dispatch<SetStateAction<Data>>
    setPromise: (promise: RequestPromise) => void
  }) => Promise<Data>
  handleError: (error: any, params: Params) => Promise<any>
}

type ManagedRequestResult<Params, Data, RequestPromise> = {
  loading: boolean
  data: Data
  error: any
  params: Params
  reloadTimes: number
  reload: (params?: Params) => Promise<Data>
  setData: Dispatch<SetStateAction<Data>>
  setLoading: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<any>>
  currentPromise: RequestPromise
  setPromise: (newPromise: PromiseUpdater<RequestPromise>) => void
}

function resolveSkip<Params>(
  skip: ManagedRequestOptions<Params, any, any>['skip'],
  params: Params,
): boolean {
  return typeof skip === 'function' ? skip(params) : !!skip
}

export function useManagedRequest<Params, Data, RequestPromise>(
  options: ManagedRequestOptions<Params, Data, RequestPromise>,
): ManagedRequestResult<Params, Data, RequestPromise> {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Data>(options.initialData)
  const [error, setError] = useState<any>()
  const [params, setParams] = useState(options.defaultParams)
  const [reloadTimes, setReloadTimes] = useState(0)
  const [fails, setFails] = useState(0)
  const [skip, setSkip] = useState(resolveSkip(options.skip, options.defaultParams))
  const promiseRef = useRef<RequestPromise>(options.idlePromise)
  const controllerRef = useRef<AbortController | null>(null)
  const pendingReloadsRef = useRef<Map<number, PendingReload<Data>>>(new Map())
  const reloadCounterRef = useRef(0)
  const executeRef = useRef(options.execute)
  const handleErrorRef = useRef(options.handleError)
  const onRequestStartRef = useRef(options.onRequestStart)
  const localSetData = setData as Dispatch<SetStateAction<Data>>
  const updateData = (options.setData ?? localSetData) as Dispatch<SetStateAction<Data>>
  const currentData = (options.data ?? data) as Data

  executeRef.current = options.execute
  handleErrorRef.current = options.handleError
  onRequestStartRef.current = options.onRequestStart

  useEqualEffect(() => {
    setSkip(resolveSkip(options.skip, params))
  }, [typeof options.skip === 'function' ? params : options.skip])

  useEqualEffect(() => {
    if (!equal(options.defaultParams, params)) {
      setParams(options.defaultParams)
    }
  }, [options.defaultParams])

  useEqualEffect(() => {
    if (!options.action || skip) {
      setLoading(false)
      return
    }

    setLoading(true)
    onRequestStartRef.current?.(updateData)

    const controller = new AbortController()
    controllerRef.current = controller
    const requestParams = (options.params ?? params) as Params

    function send() {
      executeRef
        .current({
          action: options.action,
          params: requestParams,
          signal: controller.signal,
          updateData,
          setPromise: (promise) => {
            promiseRef.current = promise
          },
        })
        .then((nextData) => {
          setFails(0)
          setError(null)
          updateData(nextData)
          setLoading(false)

          for (const { resolve } of pendingReloadsRef.current.values()) resolve(nextData)

          pendingReloadsRef.current.clear()
        })
        .catch(async (requestError) => {
          if (isAbortedRequestError(requestError)) return

          if (shouldRetryRequestError(fails, requestError)) {
            console.warn(`FaasReactClient: ${requestError.message} retry...`)
            setFails(1)
            return send()
          }

          const resolvedError = await handleErrorRef.current(requestError, requestParams)

          setError(resolvedError)
          setLoading(false)

          for (const { reject } of pendingReloadsRef.current.values()) reject(resolvedError)

          pendingReloadsRef.current.clear()
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
  }, [options.action, options.debounce, options.params || params, skip, reloadTimes, updateData])

  const reload = useEqualCallback(
    (nextParams?: Params) => {
      if (skip) setSkip(false)
      if (nextParams) setParams(nextParams)

      const reloadCounter = ++reloadCounterRef.current

      return new Promise<Data>((resolve, reject) => {
        pendingReloadsRef.current.set(reloadCounter, { resolve, reject })
        setReloadTimes((prev) => prev + 1)
      })
    },
    [skip],
  )

  return {
    loading,
    data: currentData,
    error,
    params,
    reloadTimes,
    reload,
    setData: updateData,
    setLoading,
    setError,
    currentPromise: promiseRef.current,
    setPromise: (newPromise: PromiseUpdater<RequestPromise>) => {
      promiseRef.current =
        typeof newPromise === 'function'
          ? (newPromise as (currentPromise: RequestPromise) => RequestPromise)(promiseRef.current)
          : newPromise
    },
  }
}
