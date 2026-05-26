import type { FaasActionPaths, FaasData } from '@faasjs/types'

import { Response, ResponseError } from './response'
import type { MockHandler, ResponseProps, ResolvedActionOptions } from './types'

let mock: MockHandler | ResponseProps | Response | null | undefined = null

/**
 * Set the global mock handler used by all {@link FaasBrowserClient} instances.
 *
 * When a mock handler is set, every {@link FaasBrowserClient.action} call will
 * route through the mock instead of making a real network request, which is
 * useful for testing and local development.
 *
 * @param {MockHandler | ResponseProps | Response | null | undefined} handler -
 *   A mock function that receives `(action, params, options)` and returns a
 *   response shape, or a static response/value, or `null`/`undefined` to
 *   disable mocking.
 *
 * @example
 * ```ts
 * import { setMock, Response } from '@faasjs/react'
 *
 * // Mock all requests with a static response
 * setMock({ data: { name: 'test' } })
 *
 * // Mock with a handler function
 * setMock(async (action, params) => {
 *   if (action === 'posts/get') {
 *     return { data: { title: 'Hello' } }
 *   }
 *   return new Error('Not found')
 * })
 *
 * // Disable mocking
 * setMock(null)
 * ```
 */
export function setMock(handler: MockHandler | ResponseProps | Response | null | undefined) {
  mock = handler
}

function normalizeMockResponse<T>(
  response: ResponseProps<T> | Response<T> | void | Error,
): Response<T> {
  if (response instanceof Error) throw new ResponseError(response)
  if (response instanceof Response) {
    if (
      typeof ReadableStream !== 'undefined' &&
      response.body instanceof ReadableStream &&
      response.body.locked === false
    ) {
      const [nextBody, currentBody] = response.body.tee()
      ;(response as Response<T> & { body: ReadableStream }).body = nextBody

      const clonedResponse: ResponseProps<T> = {
        status: response.status,
        headers: response.headers,
        body: currentBody,
      }

      if (response.data !== undefined) clonedResponse.data = response.data

      return new Response({
        ...clonedResponse,
      })
    }

    return response
  }

  if (
    response &&
    typeof ReadableStream !== 'undefined' &&
    response.body instanceof ReadableStream &&
    response.body.locked === false
  ) {
    const [nextBody, currentBody] = response.body.tee()
    response.body = nextBody

    return new Response({
      ...response,
      body: currentBody,
    })
  }

  return new Response(response || {})
}

/**
 * Resolve a mock response for the current request.
 *
 * If the global mock is a function it is invoked with the action, params, and
 * resolved options. Otherwise the static mock value is normalized into a
 * {@link Response} object.
 *
 * @template Path - Action path used for response data inference.
 * @param {string} action - Action path being requested.
 * @param {Record<string, any>} params - Params sent with the request.
 * @param {ResolvedActionOptions} options - Fully resolved request options.
 * @returns {Promise<Response<FaasData<Path>>>} Normalized mock response.
 */
export async function resolveMockResponse<Path extends FaasActionPaths>(
  action: string,
  params: Record<string, any>,
  options: ResolvedActionOptions,
): Promise<Response<FaasData<Path>>> {
  if (typeof mock === 'function') {
    const response = await mock(action, params, options)

    return normalizeMockResponse(response as ResponseProps<FaasData<Path>> | Error | void)
  }

  return normalizeMockResponse(mock as ResponseProps<FaasData<Path>> | Response)
}

export { mock }
