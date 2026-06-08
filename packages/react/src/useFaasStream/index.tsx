import type { FaasActionPaths, FaasData, FaasParams } from '@faasjs/types'
import { useState } from 'react'

import type { BaseUrl } from '../browser'
import { useFaasRequest } from '../useFaasRequest'

/**
 * Options that customize the {@link useFaasStream} request lifecycle.
 *
 * Stream consumers can control params, skip logic, debounce timing, polling,
 * and base URL overrides the same way {@link useFaas} does.
 */
export type UseFaasStreamOptions = {
  /** Controlled params override sent with the request without mutating local params state. */
  params?: Record<string, any>
  /** Controlled stream text used instead of internal hook state. */
  data?: string
  /** Controlled setter paired with `data`. */
  setData?: React.Dispatch<React.SetStateAction<string>>
  /** Boolean or predicate that suppresses the automatic stream request. */
  skip?: boolean | ((params: Partial<Record<string, any>>) => boolean)
  /** Milliseconds to wait before opening the latest stream request. */
  debounce?: number
  /** Milliseconds to wait after each completed stream before refreshing in the background. */
  polling?: number | false
  /** Base URL override used for this stream request lifecycle. */
  baseUrl?: BaseUrl
}

/**
 * Result returned by {@link useFaasStream}.
 *
 * @template Path - Registered action path used for params inference.
 */
export type UseFaasStreamResult<Path extends FaasActionPaths> = {
  /** Action path currently associated with the stream request. */
  action: Path
  /** Params used for the most recent request attempt. */
  params: FaasParams<Path>
  /** Whether the hook is currently waiting for stream data and should block the main UI. */
  loading: boolean
  /** Whether a background stream refresh is currently in flight. */
  refreshing: boolean
  /** Number of times `reload()` or polling has triggered a new request. */
  reloadTimes: number
  /** Accumulated text decoded from the stream response. */
  data: string
  /** Last error raised while opening or consuming the stream. */
  error: any
  /** Trigger a new streaming request with optional params. */
  reload: (params?: FaasParams<Path>, options?: { silent?: boolean }) => Promise<string>
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
 * @param {UseFaasStreamOptions} [options] - Optional hook configuration such as controlled stream text, skip logic, debounce timing, polling, and base URL overrides.
 * See the `UseFaasStreamOptions` type for `params`, `data`, `setData`, `skip`, `debounce`, `polling`, and `baseUrl`.
 * @returns {UseFaasStreamResult} Streaming request state and helper methods described by {@link UseFaasStreamResult}.
 *
 * @example
 * ```tsx
 * import { useFaasStream } from '@faasjs/react'
 *
 * declare module '@faasjs/types' {
 *   interface FaasActions {
 *     'features/chat/api/stream': {
 *       Params: { prompt: string }
 *       Data: string
 *     }
 *   }
 * }
 *
 * type ChatStreamAction = 'features/chat/api/stream'
 *
 * function Chat({ prompt }: { prompt: string }) {
 *   const { data, error, loading, reload } = useFaasStream<ChatStreamAction>(
 *     'features/chat/api/stream',
 *     { prompt },
 *   )
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
export function useFaasStream<Path extends FaasActionPaths>(
  action: Path,
  defaultParams: FaasParams<Path>,
  options: UseFaasStreamOptions = {},
): UseFaasStreamResult<Path> {
  const [data, setData] = useState<string>(options.data ?? '')
  const updateData = options.setData ?? setData
  const request = useFaasRequest<Path>({
    action,
    defaultParams,
    options: options as never,
    beforeSend: ({ silent }) => {
      if (!silent) updateData('')
    },
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

        return accumulatedText as FaasData<Path>
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
    refreshing: request.refreshing,
    reloadTimes: request.reloadTimes,
    data: options.data ?? data,
    error: request.error,
    reload: request.reload,
    setData: updateData,
    setLoading: request.setLoading,
    setError: request.setError,
  }
}
