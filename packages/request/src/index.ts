import { randomUUID } from 'node:crypto'
import { createWriteStream, readFileSync } from 'node:fs'
/**
 * FaasJS's request module.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/request.svg)](https://github.com/faasjs/faasjs/blob/main/packages/request/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/request.svg)](https://www.npmjs.com/package/@faasjs/request)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/request
 * ```
 * @packageDocumentation
 */
import type { OutgoingHttpHeaders } from 'node:http'
import { basename } from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { Logger } from '@faasjs/logger'

export type Request = {
  headers?: OutgoingHttpHeaders
  method?: string
  host?: string
  path?: string
  query?: OutgoingHttpHeaders
  body?:
    | {
        [key: string]: any
      }
    | string
}

export type Response<T = any> = {
  request?: Request
  statusCode?: number
  statusMessage?: string
  headers: OutgoingHttpHeaders
  body: T
}

export type RequestOptions = {
  headers?: OutgoingHttpHeaders
  /**
   * The HTTP method to use when making the request. Defaults to GET.
   */
  method?: string
  query?: {
    [key: string]: any
  }
  body?:
    | {
        [key: string]: any
      }
    | string
  /** Timeout in milliseconds */
  timeout?: number
  /**
   * The authentication credentials to use for the request.
   *
   * Format: `username:password`
   */
  auth?: string
  /**
   * Path of uploading a file to the server.
   *
   * ```ts
   * await request('https://example.com', { file: 'filepath' })
   * ```
   */
  file?: string
  /**
   * Create a write stream to download a file.
   *
   * ```ts
   * import { createWriteStream } from 'fs'
   *
   * const stream = createWriteStream('filepath')
   * await request('https://example.com', { downloadStream: stream })
   * ```
   */
  downloadStream?: NodeJS.WritableStream
  /**
   * Path of downloading a file from the server.
   *
   * ```ts
   * await request('https://example.com', { downloadFile: 'filepath' })
   * ```
   */
  downloadFile?: string
  /**
   * Body parser. Defaults to `JSON.parse`.
   */
  parse?: (body: string) => any
  logger?: Logger
}

export type Mock = (url: string, options: RequestOptions) => Promise<Response>

let mock: Mock | null = null

/**
 * Mock requests
 * @param handler {function | null} null to disable mock
 * @example setMock(async (url, options) => Promise.resolve({ headers: {}, statusCode: 200, body: { data: 'ok' } }))
 */
export function setMock(handler: Mock | null): void {
  mock = handler
}

export function querystringify(obj: any) {
  return Object.keys(obj)
    .map((key) => {
      const raw = obj[key]
      const value = !raw && (raw === null || raw === undefined || Number.isNaN(raw)) ? '' : raw

      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .join('&')
}

/**
 * ResponseError class
 */
export class ResponseError extends Error {
  public response: Response
  public request: Request | undefined
  public statusCode: number
  public statusMessage: string
  public headers: OutgoingHttpHeaders
  public body: any

  constructor(message: string, response: Response<any>) {
    super(message)
    this.response = response
    this.request = response.request
    this.statusCode = response.statusCode || 500
    this.statusMessage = response.statusMessage || 'Error'
    this.headers = response.headers
    this.body = response.body
  }
}

function appendQueryToUrl(url: string, query?: RequestOptions['query']): string {
  if (!query) return url

  if (!url.includes('?')) url += '?'
  else if (!url.endsWith('?')) url += '&'

  return url + querystringify(query)
}

type HeaderMap = Record<string, string>

function normalizeHeaders(source: OutgoingHttpHeaders = {}): HeaderMap {
  const headers: HeaderMap = {}

  for (const key in source) {
    const value = source[key]

    if (Array.isArray(value)) headers[key] = value.join(',')
    else if (typeof value === 'string' || typeof value === 'number') headers[key] = `${value}`
  }

  return headers
}

function findHeaderKey(headers: HeaderMap, target: string): string | undefined {
  const lowerTarget = target.toLowerCase()

  for (const key in headers) if (key.toLowerCase() === lowerTarget) return key

  return undefined
}

async function writeResponseBody(
  response: globalThis.Response,
  stream: NodeJS.WritableStream,
): Promise<void> {
  if (!response.body) {
    stream.end()
    return
  }

  await pipeline(Readable.fromWeb(response.body as any), stream as any)
}

/**
 * Request
 *
 * @param url - Request target URL.
 * @param options - Request options.
 * @returns Request response.
 * @see https://faasjs.com/doc/request.html
 */
export async function request<T = any>(
  url: string,
  options: RequestOptions = { headers: {} },
): Promise<Response<T>> {
  const requestId = randomUUID()
  const logger = options.logger || new Logger(`request][${requestId}`)

  if (mock) {
    logger.debug('mock %s %j', url, options)
    return mock(url, options)
  }

  url = appendQueryToUrl(url, options.query)

  const uri = new URL(url)
  if (!uri.protocol) throw Error('Unknown protocol')

  const method = options.method ? options.method.toUpperCase() : 'GET'
  const headers = normalizeHeaders(options.headers)

  if (
    !findHeaderKey(headers, 'Accept-Encoding') &&
    !options.downloadFile &&
    !options.downloadStream
  )
    headers['Accept-Encoding'] = 'br,gzip'

  if (options.auth && !findHeaderKey(headers, 'Authorization'))
    headers.Authorization = `Basic ${Buffer.from(options.auth).toString('base64')}`

  let body: BodyInit | undefined
  let requestBody: string | undefined

  if (options.file) {
    const contentType = findHeaderKey(headers, 'Content-Type')
    if (contentType) delete headers[contentType]

    const contentLength = findHeaderKey(headers, 'Content-Length')
    if (contentLength) delete headers[contentLength]

    const formData = new FormData()
    formData.append('file', new File([readFileSync(options.file)], basename(options.file)))
    body = formData
  }

  if (!options.file && typeof options.body !== 'undefined') {
    if (typeof options.body === 'string') requestBody = options.body
    else {
      const contentType = findHeaderKey(headers, 'Content-Type')

      requestBody =
        contentType &&
        headers[contentType].toLowerCase().includes('application/x-www-form-urlencoded')
          ? querystringify(options.body)
          : JSON.stringify(options.body)
    }

    body = requestBody
  }

  const requestSnapshot: Request = {
    headers,
    host: uri.host ? uri.host.replace(/:[0-9]+$/, '') : uri.host,
    method,
    path: uri.pathname + uri.search,
  }

  if (typeof options.query !== 'undefined')
    requestSnapshot.query = options.query as OutgoingHttpHeaders
  if (typeof requestBody !== 'undefined') requestSnapshot.body = requestBody

  const init: RequestInit = {
    method,
    headers,
  }

  if (typeof options.timeout === 'number') init.signal = AbortSignal.timeout(options.timeout)

  if (typeof body !== 'undefined') init.body = body

  logger.debug('request %j', {
    ...options,
    body: options.file ? '[form-data]' : requestBody,
  })

  logger.time(requestId)

  try {
    const res = await fetch(url, init)

    const fileStream = options.downloadFile ? createWriteStream(options.downloadFile) : undefined
    const downloadStream = options.downloadStream || fileStream

    if (downloadStream) {
      try {
        await writeResponseBody(res, downloadStream)
      } catch (error: any) {
        fileStream?.destroy()
        throw error
      }

      if (fileStream)
        logger.timeEnd(
          requestId,
          'response %s %s %s',
          res.status,
          res.headers.get('content-type'),
          fileStream.bytesWritten,
        )
      else logger.timeEnd(requestId, 'response %s %s', res.status, res.headers.get('content-type'))

      return undefined as any
    }

    const raw = await res.text()

    logger.timeEnd(
      requestId,
      'response %s %s %s %j',
      res.status,
      res.headers.get('content-type'),
      res.headers.get('content-encoding'),
      raw,
    )

    const response: Response = {
      request: requestSnapshot,
      statusCode: res.status,
      statusMessage: res.statusText,
      headers: Object.fromEntries(res.headers.entries()) as OutgoingHttpHeaders,
      body: raw,
    }

    const contentType = response.headers['content-type']

    if (
      typeof response.body === 'string' &&
      response.body &&
      typeof contentType === 'string' &&
      contentType.includes('application/json') &&
      (response.body.startsWith('{') || response.body.startsWith('['))
    )
      try {
        response.body = (options.parse || JSON.parse)(response.body)
        logger.debug('response.parse JSON')
      } catch (error: any) {
        logger.warn('response plain body', response.body)
        logger.error(error)
      }

    if (res.status >= 200 && res.status < 400) return response as Response<T>

    logger.debug('response.error %j', response)
    throw new ResponseError(
      `${res.statusText || res.status} ${requestSnapshot.host}${requestSnapshot.path}`,
      response,
    )
  } catch (error: any) {
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      logger.timeEnd(requestId, 'response.timeout')
      throw Error(`Timeout ${url}`)
    }

    if (!(error instanceof ResponseError)) logger.timeEnd(requestId, 'response.error %j', error)

    throw error
  }
}
