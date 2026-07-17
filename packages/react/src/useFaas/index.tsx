import type { FaasData, FaasParams, FaasActionPaths } from '@faasjs/types'
import { useState } from 'react'

import type { BaseUrl, Response } from '../browser'
import type { FaasDataInjection } from '../FaasDataWrapper'
import { useFaasRequest } from '../useFaasRequest'

/**
 * Options that customize the {@link useFaas} request lifecycle.
 *
 * @template Path - Registered action path used to infer params and response data.
 */
export type UseFaasOptions<Path extends FaasActionPaths> = {
  /** Controlled params override sent with the request without mutating local params state. */
  params?: FaasParams<Path>
  /** Controlled data value used instead of internal hook state. */
  data?: FaasData<Path>
  /** Controlled setter paired with `data`. */
  setData?: React.Dispatch<React.SetStateAction<FaasData<Path>>>
  /** Boolean or predicate that suppresses the automatic request. */
  skip?: boolean | ((params: Partial<FaasParams<Path>>) => boolean)
  /** Milliseconds to wait before sending the latest request. */
  debounce?: number
  /** Milliseconds to wait after each completed request before refreshing data in the background. */
  polling?: number | false
  /** Base URL override used for this request lifecycle. */
  baseUrl?: BaseUrl
}

/**
 * Request FaasJS data and keep request state in React state.
 *
 * `useFaas` is the default hook for standard FaasJS request-response flows in React.
 * It sends an initial request unless `skip` is enabled, and returns request state
 * plus helpers for reloading, background refreshing, updating data, and handling errors.
 *
 * @template Path - Registered action path used to infer params and response data.
 *
 * @param {Path} action - Action path to invoke.
 * @param {FaasParams<Path>} defaultParams - Params used for the initial request and future reloads.
 * @param {UseFaasOptions<Path>} [options] - Optional hook configuration such as controlled data, skip logic, debounce timing, polling, and base URL overrides.
 * See the `UseFaasOptions` type for `params`, `data`, `setData`, `skip`, `debounce`, `polling`, and `baseUrl`.
 * @returns {FaasDataInjection<Path>} Request state and helper methods described by {@link FaasDataInjection}.
 *
 * @example
 * ```tsx
 * import { useFaas } from '@faasjs/react'
 *
 * declare module '@faasjs/types' {
 *   interface FaasActions {
 *     'features/users/api/get': {
 *       Params: { id: number }
 *       Data: { name: string }
 *     }
 *   }
 * }
 *
 * type GetUserAction = 'features/users/api/get'
 *
 * function Profile({ id }: { id: number }) {
 *   const { data, error, loading, reload } = useFaas<GetUserAction>(
 *     'features/users/api/get',
 *     { id },
 *   )
 *
 *   if (loading) return <div>Loading...</div>
 *
 *   if (error) {
 *     return (
 *       <div>
 *         <div>Load failed: {error.message}</div>
 *         <button type="button" onClick={() => reload()}>
 *           Retry
 *         </button>
 *       </div>
 *     )
 *   }
 *
 *   return (
 *     <div>
 *       <span>{data.name}</span>
 *       <button type="button" onClick={() => reload()}>
 *         Refresh
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useFaas<Path extends FaasActionPaths>(
  action: Path,
  defaultParams: FaasParams<Path>,
  options: UseFaasOptions<Path> = {},
): FaasDataInjection<Path> {
  const [data, setData] = useState<FaasData<Path>>()
  const localSetData = setData as React.Dispatch<React.SetStateAction<FaasData<Path>>>
  const request = useFaasRequest<Path>({
    action,
    defaultParams,
    options,
    onSuccess: (nextData) => {
      if (options.setData) options.setData(nextData)
      else localSetData(nextData)
    },
    send: async ({ action, params, signal, client, setPromise }) => {
      const promise = client.faas<Path>(action, params, {
        ...(options.baseUrl ? { baseUrl: options.baseUrl } : {}),
        signal,
      })

      setPromise(promise)

      const response = await promise

      return response.data!
    },
  })

  const currentData = (options.data ?? data) as FaasData<Path>
  const currentPromise =
    request.promiseRef.current ?? Promise.resolve({} as Response<FaasData<Path>>)
  const updateData = (options.setData ?? localSetData) as React.Dispatch<
    React.SetStateAction<FaasData<Path>>
  >

  return {
    action,
    params: request.params,
    loading: request.loading,
    refreshing: request.refreshing,
    data: currentData,
    reloadTimes: request.reloadTimes,
    error: request.error,
    promise: currentPromise,
    reload: request.reload,
    setData: updateData,
    setLoading: request.setLoading,
    setPromise: (newPromise) => {
      request.promiseRef.current =
        typeof newPromise === 'function' ? newPromise(currentPromise) : newPromise
    },
    setError: request.setError,
  }
}
