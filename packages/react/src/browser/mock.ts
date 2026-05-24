import type { FaasActionPaths, FaasData } from '@faasjs/types'

import { Response, ResponseError } from './response'
import type { MockHandler, ResponseProps, ResolvedActionOptions } from './types'

let mock: MockHandler | ResponseProps | Response | null | undefined = null

/**
 * Set the global mock handler used by all {@link FaasBrowserClient} instances.
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
