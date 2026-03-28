import { useRef, useState } from 'react'

import type { BaseUrl } from './browser'
import { getClient } from './client'
import { equal, useEqualCallback, useEqualEffect } from './equal'

/**
 * Options that customize the {@link useFaasStream} request lifecycle.
 */
export type UseFaasStreamOptions = {
  /** Override the current request params without changing the hook's stored params state. */
  params?: Record<string, any>
  /** Controlled stream text used instead of the hook's internal state. */
  data?: string
  /** Controlled setter that is called instead of the hook's internal `setData`. */
  setData?: React.Dispatch<React.SetStateAction<string>>
  /**
   * If skip is true, the request will not be sent.
   *
   * However, you can still use reload to send the request.
   */
  skip?: boolean | ((params: Record<string, any>) => boolean)
  /** Delay the latest automatic request by the given number of milliseconds. */
  debounce?: number
  /** Override the default base URL for this hook instance. */
  baseUrl?: BaseUrl
}

/**
 * Result returned by {@link useFaasStream}.
 */
export type UseFaasStreamResult = {
  /** Action path currently associated with the stream request. */
  action: string
  /** Params used for the most recent request attempt. */
  params: Record<string, any>
  /** Whether the hook is currently waiting for stream data. */
  loading: boolean
  /** Number of times `reload()` has triggered a new request. */
  reloadTimes: number
  /** Accumulated text decoded from the stream response. */
  data: string
  /** Last error raised while opening or consuming the stream. */
  error: any
  /** Trigger a new streaming request with optional params. */
  reload: (params?: Record<string, any>) => Promise<string>
  /** Controlled or internal setter for the accumulated text. */
  setData: React.Dispatch<React.SetStateAction<string>>
  /** Setter for the loading flag. */
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  /** Setter for the last stream error. */
  setError: React.Dispatch<React.SetStateAction<any>>
}

/**
 * Stream a FaasJS response into React state.
 *
 * The hook sends a streaming request, appends decoded text chunks to `data`,
 * and exposes reload helpers for retrying the same action.
 *
 * @param action - Action path to invoke.
 * @param defaultParams - Params used for the initial request and future reloads.
 * @param options - Optional hook configuration such as controlled data, debounce, and skip logic.
 * @param options.params - Request params override used without mutating the hook's stored params state.
 * @param options.data - Controlled stream text used instead of the hook's internal state.
 * @param options.setData - Controlled setter used instead of the hook's internal `setData`.
 * @param options.skip - Boolean or predicate that suppresses the automatic request until `reload()` runs.
 * @param options.debounce - Milliseconds to wait before sending the latest request.
 * @param options.baseUrl - Base URL override used for this hook instance.
 * @returns Streaming request state and helper methods described by {@link UseFaasStreamResult}.
 *
 * @example
 * ```tsx
 * import { useState } from 'react'
 * import { useFaasStream } from '@faasjs/react'
 *
 * function Chat() {
 *   const [prompt, setPrompt] = useState('')
 *   const { data, loading, reload } = useFaasStream('chat', { prompt })
 *
 *   return (
 *     <div>
 *       <textarea value={prompt} onChange={e => setPrompt(e.target.value)} />
 *       <button onClick={reload} disabled={loading}>Send</button>
 *       <div>{data}</div>
 *     </div>
 *   )
 * }
 * ```
 */
export function useFaasStream(
  action: string,
  defaultParams: Record<string, any>,
  options: UseFaasStreamOptions = {},
): UseFaasStreamResult {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<string>(options.data || '')
  const [error, setError] = useState<any>()
  const [params, setParams] = useState(defaultParams)
  const [reloadTimes, setReloadTimes] = useState(0)
  const [fails, setFails] = useState(0)
  const [skip, setSkip] = useState(
    typeof options.skip === 'function' ? options.skip(defaultParams) : options.skip,
  )
  const controllerRef = useRef<AbortController | null>(null)
  const pendingReloadsRef = useRef<
    Map<
      number,
      {
        resolve: (value: string) => void
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
    setData('')

    const controller = new AbortController()
    controllerRef.current = controller

    const client = getClient(options.baseUrl)
    const requestParams = options.params ?? params

    function send() {
      client.browserClient
        .action(action, requestParams, {
          signal: controller.signal,
          stream: true,
        })
        .then(async (response) => {
          if (!response.body) {
            setError(new Error('Response body is null'))
            setLoading(false)
            return
          }

          const reader = response.body.getReader()
          const decoder = new TextDecoder()
          let accumulatedText = ''

          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break

              accumulatedText += decoder.decode(value, { stream: true })
              setData(accumulatedText)
            }

            setFails(0)
            setError(null)
            setLoading(false)

            for (const { resolve } of pendingReloadsRef.current.values()) resolve(accumulatedText)

            pendingReloadsRef.current.clear()
          } catch (readError) {
            reader.releaseLock()
            throw readError
          }
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
    (params?: Record<string, any>) => {
      if (skip) setSkip(false)
      if (params) setParams(params)

      const reloadCounter = ++reloadCounterRef.current

      return new Promise<string>((resolve, reject) => {
        pendingReloadsRef.current.set(reloadCounter, { resolve, reject })
        setReloadTimes((prev) => prev + 1)
      })
    },
    [params, skip],
  )

  return {
    action,
    params,
    loading,
    data: options.data || data,
    reloadTimes,
    error,
    reload,
    setData: options.setData || setData,
    setLoading,
    setError,
  }
}
