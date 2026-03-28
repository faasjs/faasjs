import type { FaasAction, FaasActionUnionType, FaasData, FaasParams } from '@faasjs/types'

import type { Options, Response } from './browser'
import { getClient } from './client'

/**
 * Call the currently configured FaasReactClient.
 *
 * This helper forwards the request to `getClient`. When the registered
 * client defines `onError`, the hook is invoked before the promise rejects.
 *
 * @template PathOrData - Action path or response data type used for inference.
 *
 * @param action - Action path to invoke.
 * @param params - Parameters sent to the action.
 * @param options - Optional per-request overrides such as headers or base URL.
 * See the request `Options` type for supported fields such as `headers`, `beforeRequest`,
 * `request`, `baseUrl`, and `stream`.
 * @returns Response returned by the active browser client.
 * @throws {ResponseError} When the request fails and the active client does not recover inside `onError`.
 *
 * @example
 * ```ts
 * import { faas } from '@faasjs/react'
 *
 * const response = await faas('posts/get', { id: 1 })
 *
 * console.log(response.data.title)
 * ```
 */
export async function faas<PathOrData extends FaasActionUnionType>(
  action: FaasAction<PathOrData>,
  params: FaasParams<PathOrData>,
  options?: Options,
): Promise<Response<FaasData<PathOrData>>> {
  const client = getClient(options?.baseUrl)
  const onError = client.onError

  if (onError)
    return client.browserClient.action<PathOrData>(action, params, options).catch(async (res) => {
      await onError(action as string, params)(res)
      return Promise.reject(res)
    })
  return client.browserClient.action(action, params, options)
}
