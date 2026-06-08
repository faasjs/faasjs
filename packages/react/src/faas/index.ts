import type { FaasActionPaths, FaasData, FaasParams } from '@faasjs/types'

import type { Options, Response } from '../browser'
import { getClient } from '../client'

/**
 * Call the currently configured FaasReactClient.
 *
 * This helper forwards the request to `getClient`. When the registered
 * client defines `onError`, the hook is invoked before the promise rejects.
 *
 * @template Path - Registered action path used to infer params and response data.
 *
 * @param {Path} action - Action path to invoke.
 * @param {FaasParams<Path>} params - Parameters sent to the action.
 * @param {Options} [options] - Optional per-request overrides such as headers or base URL.
 * See the browser-client `Options` type for supported fields such as `headers`, `beforeRequest`,
 * `request`, `baseUrl`, and `stream`.
 * @returns {Promise<Response<FaasData<Path>>>} Response returned by the active browser client.
 * @throws {ResponseError} When the request fails and the active client does not recover inside `onError`.
 *
 * @example
 * ```ts
 * import { faas } from '@faasjs/react'
 *
 * declare module '@faasjs/types' {
 *   interface FaasActions {
 *     'posts/get': {
 *       Params: { id: number }
 *       Data: { title: string }
 *     }
 *   }
 * }
 *
 * const response = await faas<'posts/get'>('posts/get', { id: 1 })
 *
 * console.log(response.data.title)
 * ```
 */
export async function faas<Path extends FaasActionPaths>(
  action: Path,
  params: FaasParams<Path>,
  options?: Options,
): Promise<Response<FaasData<Path>>> {
  const client = getClient(options?.baseUrl)
  const onError = client.onError

  if (onError)
    return client.browserClient.action<Path>(action, params, options).catch(async (res) => {
      await onError(action as string, params)(res)
      return Promise.reject(res)
    })
  return client.browserClient.action(action, params, options)
}
