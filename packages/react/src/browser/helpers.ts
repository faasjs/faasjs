import type { FaasActionPaths, FaasData, FaasParams } from '@faasjs/types'

import { Response, ResponseError } from './response'
import type {
  Options,
  BaseUrl,
  ResponseHeaders,
  ResolvedActionOptions,
  ParsedFetchResponse,
} from './types'

export function buildActionUrl(
  action: string,
  baseUrl: BaseUrl,
  options?: Options,
  requestId?: string,
): string {
  return `${(options?.baseUrl || baseUrl) + action}?_=${requestId}`
}

export function buildActionOptions<Path extends FaasActionPaths>(
  defaultOptions: Options,
  options: Options | undefined,
  params: FaasParams<Path>,
  requestId: string,
): ResolvedActionOptions {
  const resolvedOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    mode: 'cors' as RequestMode,
    credentials: 'include' as RequestCredentials,
    body: JSON.stringify(params),
    ...defaultOptions,
    ...(options || Object.create(null)),
  } as ResolvedActionOptions

  if (
    !resolvedOptions.headers['X-FaasJS-Request-Id'] &&
    !resolvedOptions.headers['x-faasjs-request-id']
  )
    resolvedOptions.headers['X-FaasJS-Request-Id'] = requestId

  return resolvedOptions
}

export async function runBeforeRequest<Path extends FaasActionPaths>(
  action: Path,
  params: FaasParams<Path>,
  options: ResolvedActionOptions,
): Promise<void> {
  if (!options.beforeRequest) return

  await options.beforeRequest({
    action,
    params,
    options,
    headers: options.headers,
  })
}

export function toResponseHeaders(headers: Iterable<[string, string]>): ResponseHeaders {
  const responseHeaders: ResponseHeaders = {}

  for (const [key, value] of headers) responseHeaders[key] = value

  return responseHeaders
}

export function parseSuccessfulResponse<Path extends FaasActionPaths>(
  status: number,
  headers: ResponseHeaders,
  text: string,
): Response<FaasData<Path>> {
  if (!text)
    return new Response({
      status,
      headers,
    })

  const body = JSON.parse(text)

  if (body.error?.message)
    throw new ResponseError({
      message: body.error.message,
      status,
      headers,
      body,
    })

  return new Response({
    status,
    headers,
    body,
    data: body.data,
  })
}

export function parseFailedResponse(status: number, headers: ResponseHeaders, text: string): never {
  try {
    const body = JSON.parse(text)

    if (body.error?.message)
      throw new ResponseError({
        message: body.error.message,
        status,
        headers,
        body,
      })

    throw new ResponseError({
      message: text,
      status,
      headers,
      body,
    })
  } catch (error) {
    if (error instanceof ResponseError) throw error

    throw new ResponseError({
      message: text,
      status,
      headers,
      body: text,
    })
  }
}

export async function parseFetchResponse<Path extends FaasActionPaths>(
  response: ParsedFetchResponse,
): Promise<Response<FaasData<Path>>> {
  const headers = toResponseHeaders(response.headers)
  const text = await response.text()

  if (response.status >= 200 && response.status < 300)
    return parseSuccessfulResponse<Path>(response.status, headers, text)

  return parseFailedResponse(response.status, headers, text)
}
