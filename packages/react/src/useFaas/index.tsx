import type { FaasData, FaasParams, FaasActionPaths } from '@faasjs/types'
import { useState } from 'react'

import type { Response } from '../browser'
import type { FaasDataInjection } from '../FaasDataWrapper'
import { useFaasRequest, type SharedUseFaasOptions } from '../useFaasRequest'

/**
 * Options that customize the {@link useFaas} request lifecycle.
 *
 * @template Path - Action path or response data type used for inference.
 */
export type UseFaasOptions<Path extends FaasActionPaths> = SharedUseFaasOptions<
  FaasParams<Path>,
  FaasData<Path>
>

/**
 * Request FaasJS data and keep request state in React state.
 *
 * `useFaas` is the default hook for standard FaasJS request-response flows in React.
 * It sends an initial request unless `skip` is enabled, and returns request state
 * plus helpers for reloading, background refreshing, updating data, and handling errors.
 *
 * @template Path - Action path or response data type used for inference.
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
 * function Profile({ id }: { id: number }) {
 *   const { data, error, loading, reload } = useFaas('/pages/users/get', { id })
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
      if (options.setData) options.setData(nextData.data!)
      else localSetData(nextData.data!)
    },
    send: ({ action, params, signal, client, setPromise }) => {
      const promise = client.faas<Path>(action, params, {
        signal,
      })

      setPromise(promise)

      return promise
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
