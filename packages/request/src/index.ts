import http from 'node:http'
import https from 'node:https'
import { URL } from 'node:url'
import { readFileSync, createWriteStream } from 'node:fs'
import { basename } from 'node:path'
import { Logger } from '@faasjs/logger'
import { createGunzip, createBrotliDecompress } from 'node:zlib'
import { randomUUID } from 'node:crypto'

export type Request = {
  headers?: http.OutgoingHttpHeaders
  method?: string
  host?: string
  path?: string
  query?: http.OutgoingHttpHeaders
  body?: {
    [key: string]: any
  }
}

export type Response<T = any> = {
  request?: Request
  statusCode?: number
  statusMessage?: string
  headers: http.OutgoingHttpHeaders
  body: T
}

export type RequestOptions = {
  headers?: http.OutgoingHttpHeaders
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
  /** Timeout in milliseconds, @default 5000 */
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
  pfx?: Buffer
  passphrase?: string
  agent?: boolean
  /**
   * Body parser. Defaults to `JSON.parse`.
   */
  parse?: (body: string) => any
  logger?: Logger
}

type Mock = (url: string, options: RequestOptions) => Promise<Response>

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
  const pairs: string[] = []
  let value
  let key

  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      value = obj[key]

      if (
        !value &&
        (value === null || value === undefined || Number.isNaN(value))
      ) {
        value = ''
      }

      key = encodeURIComponent(key)
      value = encodeURIComponent(value)

      if (key === null || value === null) continue
      pairs.push(`${key}=${value}`)
    }
  }

  return pairs.length ? pairs.join('&') : ''
}

/**
 * ResponseError class
 */
export class ResponseError extends Error {
  public response: Response
  public request: Request
  public statusCode: number
  public statusMessage: string
  public headers: http.OutgoingHttpHeaders
  public body: any

  constructor(message: string, response: Response<any>) {
    super(message)
    this.response = response
    this.request = response.request
    this.statusCode = response.statusCode
    this.statusMessage = response.statusMessage
    this.headers = response.headers
    this.body = response.body
  }
}

/**
 * Request
 *
 * @param {string} url Url
 * @param {object=} [options={}] Options
 * @param {string} [options.method=GET] Method
 * @param {object} [options.query={}] Query
 * @param {object} [options.headers={}] Headers
 * @param {object=} options.body Body
 * @param {number=} options.timeout Timeout
 * @param {string=} options.auth Auth, format: user:password
 * @param {string=} options.file Upload file path
 * @param {WritableStream=} options.downloadStream Download stream
 * @param {string=} options.downloadFile Download to file
 * @param {Buffer=} options.pfx pfx
 * @param {string=} options.passphrase passphrase
 * @param {boolean=} options.agent agent
 * @param {parse=} options.parse body parser, default is JSON.parse
 *
 * @returns {promise}
 *
 * @url https://faasjs.com/doc/request.html
 */
export async function request<T = any>(
  url: string,
  options: RequestOptions = { headers: {} }
): Promise<Response<T>> {
  const logger = options.logger || new Logger('request')

  if (mock) {
    logger.debug('mock %s %j', url, options)
    return mock(url, options)
  }

  if (options.query) {
    if (!url.includes('?')) url += '?'
    else if (!url.endsWith('?')) url += '&'

    url += querystringify(options.query)
  }

  if (!options.headers) options.headers = {}

  const uri = new URL(url)
  const protocol = uri.protocol === 'https:' ? https : http

  if (!uri.protocol) throw Error('Unknown protocol')

  const requestOptions: https.RequestOptions = {
    headers: {},
    host: uri.host ? uri.host.replace(/:[0-9]+$/, '') : uri.host,
    method: options.method ? options.method.toUpperCase() : 'GET',
    path: uri.pathname + uri.search,
    port: uri.port || (uri.protocol === 'https:' ? '443' : '80'),
    timeout: options.timeout || 5000,
    auth: options.auth,
    pfx: options.pfx,
    passphrase: options.passphrase,
    agent: options.agent,
  }

  if (
    !options.headers['Accept-Encoding'] &&
    !options.downloadFile &&
    !options.downloadStream
  )
    options.headers['Accept-Encoding'] = 'br,gzip'

  for (const key in options.headers)
    if (
      typeof options.headers[key] !== 'undefined' &&
      options.headers[key] !== null
    )
      requestOptions.headers[key] = options.headers[key]

  let body = options.body
  if (body && typeof body !== 'string')
    if (
      options.headers['Content-Type']
        ?.toString()
        .includes('application/x-www-form-urlencoded')
    )
      body = querystringify(body)
    else body = JSON.stringify(body)

  if (body && !options.headers['Content-Length'])
    requestOptions.headers['Content-Length'] = Buffer.byteLength(body as string)

  const requestId = randomUUID()

  return await new Promise((resolve, reject) => {
    logger.debug('request %j', {
      ...options,
      body,
    })

    const req = protocol.request(
      requestOptions,
      (res: http.IncomingMessage) => {
        if (options.downloadStream) {
          options.downloadStream
            .on('error', (error: Error) => {
              logger.timeEnd(requestId, 'response.error %j', error)
              reject(error)
            })
            .on('finish', () => {
              logger.timeEnd(
                requestId,
                'response %s %s',
                res.statusCode,
                res.headers['content-type']
              )
              options.downloadStream.end()
              resolve(undefined)
            })
          res.pipe(options.downloadStream, { end: true })
          return
        }

        if (options.downloadFile) {
          const stream = createWriteStream(options.downloadFile)
            .on('error', (error: Error) => {
              logger.timeEnd(requestId, 'response.error %j', error)
              stream.destroy()
              reject(error)
            })
            .on('finish', () => {
              logger.timeEnd(
                requestId,
                'response %s %s %s',
                res.statusCode,
                res.headers['content-type'],
                stream.bytesWritten
              )
              resolve(undefined)
            })

          res.pipe(stream, { end: true })

          return
        }

        let stream: NodeJS.ReadableStream = res

        switch (res.headers['content-encoding']) {
          case 'br':
            stream = res.pipe(createBrotliDecompress())
            break
          case 'gzip':
            stream = res.pipe(createGunzip())
            break
        }

        const raw: Buffer[] = []
        stream
          .on('error', (e: Error) => {
            logger.timeEnd(requestId, 'response.error %j', e)
            reject(e)
          })
          .on('end', () => {
            const data = Buffer.concat(raw).toString()
            logger.timeEnd(
              requestId,
              'response %s %s %s %j',
              res.statusCode,
              res.headers['content-type'],
              res.headers['content-encoding'],
              data
            )

            const response = Object.create(null)
            response.request = requestOptions
            response.request.body = body
            response.statusCode = res.statusCode
            response.statusMessage = res.statusMessage
            response.headers = res.headers
            response.body = data

            if (
              response.body &&
              response.headers['content-type'] &&
              response.headers['content-type'].includes('application/json')
            )
              try {
                response.body = (options.parse || JSON.parse)(response.body)
                logger.debug('response.parse JSON')
              } catch (error: any) {
                logger.warn('response plain body', response.body)
                logger.error(error)
              }

            if (response.statusCode >= 200 && response.statusCode < 400)
              resolve(response)
            else {
              logger.debug('response.error %j', response)
              reject(
                new ResponseError(
                  `${res.statusMessage || res.statusCode} ${
                    requestOptions.host
                  }${requestOptions.path}`,
                  response
                )
              )
            }
          })
          .on('data', (chunk: any) => raw.push(chunk))
      }
    )

    if (body) req.write(body)

    if (options.file) {
      const crlf = '\r\n'
      const boundary = `--${Math.random().toString(16)}`
      const delimiter = `${crlf}--${boundary}`
      const headers = [
        `Content-Disposition: form-data; name="file"; filename="${basename(
          options.file
        )}"${crlf}`,
      ]

      const multipartBody = Buffer.concat([
        Buffer.from(delimiter + crlf + headers.join('') + crlf),
        readFileSync(options.file),
        Buffer.from(`${delimiter}--`),
      ])

      req.setHeader('Content-Type', `multipart/form-data; boundary=${boundary}`)
      req.setHeader('Content-Length', multipartBody.length)

      req.write(multipartBody)
    }

    req.on('error', (e: Error) => {
      logger.timeEnd(requestId, 'response.error %j', e)
      reject(e)
    })

    req.on('timeout', () => {
      logger.timeEnd(requestId, 'response.timeout')
      req.destroy()
      reject(Error(`Timeout ${url}`))
    })

    logger.time(requestId)

    req.end()
  })
}
