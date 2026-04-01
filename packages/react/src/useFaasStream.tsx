import type { BaseUrl, Response } from './browser'
import { getClient } from './client'
import { applyClientOnError } from './requestHelpers'
import { useManagedRequest } from './useManagedRequest'

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
 * `useFaasStream` is the default hook for streaming FaasJS responses in React.
 * It sends a streaming request, appends decoded text chunks to `data`, and
 * exposes reload helpers for retrying the same action.
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
 * import { useFaasStream } from '@faasjs/react'
 *
 * function Chat({ prompt }: { prompt: string }) {
 *   const { data, error, loading, reload } = useFaasStream('/pages/chat/stream', { prompt })
 *
 *   if (loading) return <div>Streaming...</div>
 *
 *   if (error) {
 *     return (
 *       <div>
 *         <div>Stream failed: {error.message}</div>
 *         <button type="button" onClick={() => reload()}>
 *           Retry
 *         </button>
 *       </div>
 *     )
 *   }
 *
 *   return <pre>{data}</pre>
 * }
 * ```
 */
export function useFaasStream(
  action: string,
  defaultParams: Record<string, any>,
  options: UseFaasStreamOptions = {},
): UseFaasStreamResult {
  const { loading, data, error, params, reloadTimes, reload, setData, setLoading, setError } =
    useManagedRequest<Record<string, any>, string, Promise<Response>>({
      action,
      defaultParams,
      params: options.params,
      data: options.data,
      setData: options.setData,
      skip: options.skip,
      debounce: options.debounce,
      initialData: options.data || '',
      idlePromise: Promise.resolve({} as Response),
      onRequestStart: (updateData) => {
        updateData('')
      },
      execute: async ({ action, params, signal, updateData, setPromise }) => {
        const client = getClient(options.baseUrl)
        const request = client.browserClient.action(action, params, {
          signal,
          stream: true,
        })

        setPromise(request)

        const response = await request

        if (!response.body) throw new Error('Response body is null')

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let accumulatedText = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            accumulatedText += decoder.decode(value, { stream: true })
            updateData(accumulatedText)
          }
        } catch (readError) {
          reader.releaseLock()
          throw readError
        }

        return accumulatedText
      },
      handleError: async (requestError, requestParams) => {
        const client = getClient(options.baseUrl)

        return applyClientOnError(client, action, requestParams, requestError)
      },
    })

  return {
    action,
    params,
    loading,
    data,
    reloadTimes,
    error,
    reload,
    setData,
    setLoading,
    setError,
  }
}
