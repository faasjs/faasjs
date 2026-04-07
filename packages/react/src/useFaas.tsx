import type { FaasAction, FaasActionUnionType, FaasData, FaasParams } from '@faasjs/types'
import { useState } from 'react'

import type { Response } from './browser'
import type { FaasDataInjection } from './FaasDataWrapper'
import { useFaasRequest, type SharedUseFaasOptions } from './useFaasRequest'

/**
 * Options that customize the {@link useFaas} request lifecycle.
 *
 * @template PathOrData - Action path or response data type used for inference.
 */
export type useFaasOptions<PathOrData extends FaasActionUnionType> = SharedUseFaasOptions<
  FaasParams<PathOrData>,
  FaasData<PathOrData>
>

/**
 * Request FaasJS data and keep request state in React state.
 *
 * `useFaas` is the default hook for standard FaasJS request-response flows in React.
 * It sends an initial request unless `skip` is enabled, and returns request state
 * plus helpers for reloading, updating data, and handling errors.
 *
 * @template PathOrData - Action path or response data type used for inference.
 *
 * @param action - Action path to invoke.
 * @param defaultParams - Params used for the initial request and future reloads.
 * @param options - Optional hook configuration such as controlled data, debounce, and skip logic.
 * @param options.params - Request params override used without mutating the hook's stored params state.
 * @param options.data - Controlled data value used instead of the hook's internal state.
 * @param options.setData - Controlled setter used instead of the hook's internal `setData`.
 * @param options.skip - Boolean or predicate that suppresses the automatic request until `reload()` runs.
 * @param options.debounce - Milliseconds to wait before sending the latest request.
 * @param options.baseUrl - Base URL override used for this hook instance.
 * @returns Request state and helper methods described by {@link FaasDataInjection}.
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
export function useFaas<PathOrData extends FaasActionUnionType>(
  action: FaasAction<PathOrData>,
  defaultParams: FaasParams<PathOrData>,
  options: useFaasOptions<PathOrData> = {},
): FaasDataInjection<PathOrData> {
  const [data, setData] = useState<FaasData<PathOrData>>()
  const localSetData = setData as React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>
  const request = useFaasRequest<
    FaasParams<PathOrData>,
    FaasData<PathOrData>,
    Promise<Response<FaasData<PathOrData>>>
  >({
    action,
    defaultParams,
    options,
    onSuccess: (nextData) => {
      if (options.setData) options.setData(nextData)
      else localSetData(nextData)
    },
    send: ({ action, params, signal, client, setPromise }) => {
      const promise = client.faas<PathOrData>(action as FaasAction<PathOrData>, params, {
        signal,
      })

      setPromise(promise)

      return promise.then((response) => response.data as FaasData<PathOrData>)
    },
  })

  const currentData = (options.data ?? data) as FaasData<PathOrData>
  const currentPromise =
    request.promiseRef.current ?? Promise.resolve({} as Response<FaasData<PathOrData>>)
  const updateData = (options.setData ?? localSetData) as React.Dispatch<
    React.SetStateAction<FaasData<PathOrData>>
  >

  return {
    action,
    params: request.params,
    loading: request.loading,
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
