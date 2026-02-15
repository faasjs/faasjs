import type { Options, Response } from '@faasjs/browser'
import type {
  FaasAction,
  FaasActionUnionType,
  FaasData,
  FaasParams,
} from '@faasjs/types'
import { getClient } from './client'

/**
 * Request faas server
 *
 * @param action {string} action name
 * @param params {object} action params
 * @returns {Promise<Response<any>>}
 *
 * @example
 * ```ts
 * faas<{ title: string }>('post/get', { id: 1 }).then(res => {
 *   console.log(res.data.title)
 * })
 * ```
 */
export async function faas<PathOrData extends FaasActionUnionType>(
  action: FaasAction<PathOrData>,
  params: FaasParams<PathOrData>,
  options?: Options
): Promise<Response<FaasData<PathOrData>>> {
  const client = getClient(options?.baseUrl)
  const onError = client.onError

  if (onError)
    return client.browserClient
      .action<PathOrData>(action, params, options)
      .catch(async res => {
        await onError(action as string, params)(res)
        return Promise.reject(res)
      })
  return client.browserClient.action(action, params, options)
}
