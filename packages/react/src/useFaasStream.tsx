import { useState } from 'react'

import { useFaasRequest, type SharedUseFaasOptions } from './useFaasRequest'

/**
 * Options that customize the {@link useFaasStream} request lifecycle.
 */
export type UseFaasStreamOptions = SharedUseFaasOptions<Record<string, any>, string>

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
 * @param {string} action - Action path to invoke.
 * @param {Record<string, any>} defaultParams - Params used for the initial request and future reloads.
 * @param {UseFaasStreamOptions} [options] - Optional hook configuration such as controlled stream text, skip logic, debounce timing, and base URL overrides.
 * See the `UseFaasStreamOptions` type for `params`, `data`, `setData`, `skip`, `debounce`, and `baseUrl`.
 * @returns {UseFaasStreamResult} Streaming request state and helper methods described by {@link UseFaasStreamResult}.
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
  const [data, setData] = useState<string>(options.data ?? '')
  const updateData = options.setData ?? setData
  const request = useFaasRequest<Record<string, any>, string>({
    action,
    defaultParams,
    options,
    beforeSend: () => updateData(''),
    send: async ({ action, params, signal, client }) => {
      const response = await client.browserClient.action(action, params, {
        signal,
        stream: true,
      })

      if (!response.body) throw new Error('Response body is null')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''
      const onAbort = () => {
        void reader.cancel().catch(() => undefined)
      }

      if (signal.aborted) {
        onAbort()
        throw new Error('Request aborted')
      }

      signal.addEventListener('abort', onAbort, { once: true })

      try {
        while (true) {
          if (signal.aborted) throw new Error('Request aborted')

          const { done, value } = await reader.read()
          if (done) break

          accumulatedText += decoder.decode(value, { stream: true })
          updateData(accumulatedText)
        }

        accumulatedText += decoder.decode()

        return accumulatedText
      } catch (error) {
        if (signal.aborted) throw new Error('Request aborted')

        throw error
      } finally {
        signal.removeEventListener('abort', onAbort)

        try {
          reader.releaseLock()
        } catch {}
      }
    },
  })

  return {
    action,
    params: request.params,
    loading: request.loading,
    reloadTimes: request.reloadTimes,
    data: options.data ?? data,
    error: request.error,
    reload: request.reload,
    setData: updateData,
    setLoading: request.setLoading,
    setError: request.setError,
  }
}
