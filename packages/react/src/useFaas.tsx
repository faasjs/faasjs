import type { FaasAction, FaasActionUnionType, FaasData, FaasParams } from '@faasjs/types'

import type { BaseUrl, Response } from './browser'
import { getClient } from './client'
import type { FaasDataInjection } from './FaasDataWrapper'
import { applyClientOnError } from './requestHelpers'
import { useManagedRequest } from './useManagedRequest'

/**
 * Options that customize the {@link useFaas} request lifecycle.
 *
 * @template PathOrData - Action path or response data type used for inference.
 */
export type useFaasOptions<PathOrData extends FaasActionUnionType> = {
  /** Override the current request params without changing the hook's stored params state. */
  params?: FaasParams<PathOrData>
  /** Controlled data value used instead of the hook's internal state. */
  data?: FaasData<PathOrData>
  /** Controlled setter that is called instead of the hook's internal `setData`. */
  setData?: React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>
  /**
   * If skip is true, the request will not be sent.
   *
   * However, you can still use reload to send the request.
   */
  skip?: boolean | ((params: FaasParams<PathOrData>) => boolean)
  /** Delay the latest automatic request by the given number of milliseconds. */
  debounce?: number
  /** Override the default base URL for this hook instance. */
  baseUrl?: BaseUrl
}

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
  const {
    loading,
    data,
    error,
    params,
    reloadTimes,
    reload,
    setData,
    setLoading,
    setError,
    currentPromise,
    setPromise,
  } = useManagedRequest<
    FaasParams<PathOrData>,
    FaasData<PathOrData>,
    Promise<Response<FaasData<PathOrData>>>
  >({
    action: action as string,
    defaultParams,
    params: options.params,
    data: options.data,
    setData: options.setData,
    skip: options.skip,
    debounce: options.debounce,
    initialData: undefined as FaasData<PathOrData>,
    idlePromise: Promise.resolve({} as Response<FaasData<PathOrData>>),
    execute: ({ params, signal, setPromise }) => {
      const client = getClient(options.baseUrl)
      const request = client.browserClient.action<PathOrData>(action, params, { signal })

      setPromise(request)

      return request.then((response) => response.data as FaasData<PathOrData>)
    },
    handleError: async (requestError, requestParams) => {
      const client = getClient(options.baseUrl)

      return applyClientOnError(client, action as string, requestParams, requestError)
    },
  })

  return {
    action,
    params,
    loading,
    data,
    reloadTimes,
    error,
    promise: currentPromise,
    reload,
    setData,
    setLoading,
    setPromise,
    setError,
  }
}
