import type { FaasActionPaths, FaasData, FaasParams } from '@faasjs/types'

import { Response, ResponseError } from './response'
import type {
  Options,
  BaseUrl,
  ResponseHeaders,
  ResolvedActionOptions,
  ParsedFetchResponse,
} from './types'

function mergeRequestHeaders(
  ...sources: Array<Record<string, string> | undefined>
): Record<string, string> {
  const headers: Record<string, string> = {}
  const headerNames = new Map<string, string>()

  for (const source of sources) {
    if (!source) continue

    for (const [key, value] of Object.entries(source)) {
      const normalizedKey = key.toLowerCase()
      const previousKey = headerNames.get(normalizedKey)

      if (previousKey && previousKey !== key) delete headers[previousKey]

      headers[key] = value
      headerNames.set(normalizedKey, key)
    }
  }

  return headers
}

/**
 * Build the full request URL for an action, with optional request-id query parameter.
 *
 * @param {string} action - Action path to append to the base URL.
 * @param {BaseUrl} baseUrl - Default base URL used when the request options do not override it.
 * @param {Options} [options] - Per-request options whose `baseUrl` field overrides `baseUrl`.
 * @param {string} [requestId] - Unique request identifier appended as the `_` query parameter.
 * @returns {string} Fully assembled request URL.
 */
export function buildActionUrl(
  action: string,
  baseUrl: BaseUrl,
  options?: Options,
  requestId?: string,
): string {
  return `${(options?.baseUrl || baseUrl) + action}?_=${requestId}`
}

/**
 * Merge default and per-request options into a fully resolved request configuration.
 *
 * Sets method to `POST`, adds JSON content-type and CORS credentials, serializes params
 * as JSON body, and injects the `X-FaasJS-Request-Id` header unless already present.
 *
 * @template Path - Action path used for params inference.
 * @param {Options} defaultOptions - Client-wide default options merged into every request.
 * @param {Options | undefined} options - Per-request overrides applied on top of defaults.
 * @param {FaasParams<Path>} params - Params to serialize as the JSON request body.
 * @param {string} requestId - Unique request identifier injected into headers.
 * @returns {ResolvedActionOptions} Fully resolved request options ready for `fetch`.
 */
export function buildActionOptions<Path extends FaasActionPaths>(
  defaultOptions: Options,
  options: Options | undefined,
  params: FaasParams<Path>,
  requestId: string,
): ResolvedActionOptions {
  const resolvedOptions = {
    method: 'POST',
    mode: 'cors' as RequestMode,
    credentials: 'include' as RequestCredentials,
    body: JSON.stringify(params),
    ...defaultOptions,
    ...(options || Object.create(null)),
    headers: mergeRequestHeaders(
      { 'Content-Type': 'application/json; charset=UTF-8' },
      defaultOptions.headers,
      options?.headers,
    ),
  } as ResolvedActionOptions

  if (
    !Object.keys(resolvedOptions.headers).some((key) => key.toLowerCase() === 'x-faasjs-request-id')
  )
    resolvedOptions.headers['X-FaasJS-Request-Id'] = requestId

  return resolvedOptions
}

/**
 * Invoke the `beforeRequest` hook if it is configured in the resolved options.
 *
 * @template Path - Action path used for params inference.
 * @param {Path} action - Action path being requested.
 * @param {FaasParams<Path>} params - Params being sent with the request.
 * @param {ResolvedActionOptions} options - Resolved options that may carry a `beforeRequest` callback.
 * @returns {Promise<void>} Resolves after the hook (if any) completes.
 */
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

/**
 * Convert fetch `Headers` iterable to a plain key-value object.
 *
 * @param {Iterable<[string, string]>} headers - Iterable of header name/value pairs.
 * @returns {ResponseHeaders} Plain object keyed by lower-cased header names.
 */
export function toResponseHeaders(headers: Iterable<[string, string]>): ResponseHeaders {
  const responseHeaders: ResponseHeaders = {}

  for (const [key, value] of headers) responseHeaders[key] = value

  return responseHeaders
}

/**
 * Parse a successful (2xx) HTTP response body into a {@link Response} object.
 *
 * If the parsed body contains an `error.message` property the response is treated
 * as a logical error and a {@link ResponseError} is thrown instead.
 *
 * @template Path - Action path used for response data inference.
 * @param {number} status - HTTP status code.
 * @param {ResponseHeaders} headers - Response headers.
 * @param {string} text - Raw response body text.
 * @returns {Response<FaasData<Path>>} Wrapped response containing the parsed data.
 * @throws {ResponseError} When the body contains a logical `error.message`.
 */
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

/**
 * Parse a failed (non-2xx) HTTP response and always throw a {@link ResponseError}.
 *
 * @param {number} status - HTTP status code.
 * @param {ResponseHeaders} headers - Response headers.
 * @param {string} text - Raw response body text.
 * @returns {never} Always throws – never returns normally.
 * @throws {ResponseError} Wrapped error containing the HTTP status, headers, and body.
 */
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

/**
 * Read and parse a native fetch response into a FaasJS {@link Response} or throw on failure.
 *
 * Routes to {@link parseSuccessfulResponse} for 2xx status codes and
 * {@link parseFailedResponse} for all others.
 *
 * @template Path - Action path used for response data inference.
 * @param {ParsedFetchResponse} response - Parsed fetch response with headers, status, and text body.
 * @returns {Promise<Response<FaasData<Path>>>} Wrapped FaasJS response on success.
 * @throws {ResponseError} When the HTTP status indicates a failure.
 */
export async function parseFetchResponse<Path extends FaasActionPaths>(
  response: ParsedFetchResponse,
): Promise<Response<FaasData<Path>>> {
  const headers = toResponseHeaders(response.headers)
  const text = await response.text()

  if (response.status >= 200 && response.status < 300)
    return parseSuccessfulResponse<Path>(response.status, headers, text)

  return parseFailedResponse(response.status, headers, text)
}
