import * as http from 'http'
import * as https from 'https'
import { URL } from 'url'
import { readFileSync } from 'fs'
import { basename } from 'path'
import { Logger } from '@faasjs/logger'

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
  body?: {
    [key: string]: any
  } | string
  timeout?: number
  /**
   * The authentication credentials to use for the request.
   *
   * Format: `username:password`
   */
  auth?: string
  /**
   * Path of uploading a file to the server.
   */
  file?: string
  /**
   * Create a write stream to download a file.
   */
  downloadStream?: NodeJS.WritableStream
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
export function setMock (handler: Mock | null): void {
  mock = handler
}

export function querystringify (obj: any) {
  const pairs:string[] = []
  let value
  let key

  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      value = obj[key]

      if (!value && (value === null || value === undefined || isNaN(value))) {
        value = ''
      }

      key = encodeURIComponent(key)
      value = encodeURIComponent(value)

      if (key === null || value === null) continue
      pairs.push(key + '=' + value)
    }
  }

  return pairs.length ? pairs.join('&') : ''
}

/**
 * Request
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
 * @param {Buffer=} options.pfx pfx
 * @param {string=} options.passphrase passphrase
 * @param {boolean=} options.agent agent
 * @param {parse=} options.parse body parser, default is JSON.parse
 *
 * @returns {promise}
 * @url https://faasjs.com/doc/request.html
 */
export async function request<T = any> (url: string, {
  headers,
  method,
  query,
  body,
  timeout,
  auth,
  file,
  downloadStream,
  pfx,
  passphrase,
  agent,
  parse,
  logger,
}: RequestOptions = {
  headers: {},
  query: {}
}): Promise<Response<T>> {
  if (!logger)
    logger = new Logger('request')

  if (mock)
    return mock(url, {
      headers,
      method,
      query,
      body
    })

  if (query) {
    if (!url.includes('?'))
      url += '?'
    else if (!url.endsWith('?'))
      url += '&'

    url += querystringify(query)
  }

  const uri = new URL(url)
  const protocol = uri.protocol === 'https:' ? https : http

  if (!uri.protocol) throw Error('Unknown protocol')

  const options: {
    method: string
    headers: http.OutgoingHttpHeaders
    query: http.OutgoingHttpHeaders
    host?: string
    path: string
    port: string
    timeout?: number
    auth?: string
    pfx?: Buffer
    passphrase?: string
    agent?: boolean
  } = {
    headers: {},
    host: uri.host ? uri.host.replace(/:[0-9]+$/, '') : uri.host,
    method: method ? method.toUpperCase() : 'GET',
    path: uri.pathname + uri.search,
    query: {},
    port: uri.port,
    timeout,
    auth,
    pfx,
    passphrase,
    agent
  }

  for (const key in headers)
    if (typeof headers[key] !== 'undefined' && headers[key] !== null)
      options.headers[key] = headers[key]

  if (body && typeof body !== 'string')
    if (
      options.headers['Content-Type'] &&
      options.headers['Content-Type'].toString().includes('application/x-www-form-urlencoded')
    )
      body = querystringify(body)
    else
      body = JSON.stringify(body)

  if (body && !options.headers['Content-Length'])
    options.headers['Content-Length'] = Buffer.byteLength(body as string)

  return await new Promise(function (resolve, reject) {
    logger.debug('request %j', {
      ...options,
      body
    })

    const req = protocol.request(options, function (res: http.IncomingMessage) {
      if (downloadStream) {
        res.pipe(downloadStream)
        downloadStream.on('finish', function () {
          resolve(undefined)
        })
      } else {
        const raw: Buffer[] = []
        res.on('data', (chunk: any) => {
          raw.push(chunk)
        })
        res.on('end', () => {
          const data = Buffer.concat(raw).toString()
          logger.timeEnd(url, 'response %s %s %s', res.statusCode, res.headers['content-type'], data)

          const response = Object.create(null)
          response.request = options
          response.request.body = body
          response.statusCode = res.statusCode
          response.statusMessage = res.statusMessage
          response.headers = res.headers
          response.body = data

          if (response.body && response.headers['content-type'] && response.headers['content-type'].includes('application/json'))
            try {
              response.body = (parse) ? parse(response.body) : JSON.parse(response.body)
              logger.debug('response.parse JSON')
            } catch (error) {
              console.error(error)
            }


          if (response.statusCode >= 200 && response.statusCode < 400) resolve(response); else {
            logger.debug('response.error %j', response)
            reject(response)
          }
        })
      }
    })

    if (body) req.write(body)

    if (file) {
      const crlf = '\r\n'
      const boundary = `--${Math.random().toString(16)}`
      const delimiter = `${crlf}--${boundary}`
      const headers = [`Content-Disposition: form-data; name="file"; filename="${basename(file)}"${crlf}`]

      const multipartBody = Buffer.concat([
        Buffer.from(delimiter + crlf + headers.join('') + crlf),
        readFileSync(file),
        Buffer.from(`${delimiter}--`)
      ])

      req.setHeader('Content-Type', 'multipart/form-data; boundary=' + boundary)
      req.setHeader('Content-Length', multipartBody.length)

      req.write(multipartBody)
    }

    req.on('error', function (e: Error) {
      logger.timeEnd(url, 'response.error %j', e)
      reject(e)
    })

    logger.time(url)
    req.end()
  })
}
