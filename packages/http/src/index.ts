/**
 * FaasJS's http plugin.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/http.svg)](https://github.com/faasjs/faasjs/blob/main/packages/http/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/http.svg)](https://www.npmjs.com/package/@faasjs/http)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/http
 * ```
 *
 * @packageDocumentation
 */
import { createBrotliCompress, createDeflate, createGzip } from 'node:zlib'
import {
  type InvokeData,
  type MountData,
  type Next,
  type Plugin,
  type UseifyPlugin,
  usePlugin,
} from '@faasjs/func'
import { deepMerge } from '@faasjs/node-utils'
import { Cookie, type CookieOptions } from './cookie'
import type { Session } from './session'

export {
  Cookie,
  type CookieOptions,
} from './cookie'

export {
  Session,
  type SessionContent,
  type SessionOptions,
} from './session'

export const ContentType: {
  [key: string]: string
} = {
  plain: 'text/plain',
  html: 'text/html',
  xml: 'application/xml',
  csv: 'text/csv',
  css: 'text/css',
  javascript: 'application/javascript',
  json: 'application/json',
  jsonp: 'application/javascript',
}

export type HttpConfig = {
  [key: string]: any
  name?: string
  config?: {
    [key: string]: any
    /** POST as default */
    method?:
      | 'BEGIN'
      | 'GET'
      | 'POST'
      | 'DELETE'
      | 'HEAD'
      | 'PUT'
      | 'OPTIONS'
      | 'TRACE'
      | 'PATCH'
      | 'ANY'
    timeout?: number
    /** file relative path as default */
    path?: string
    ignorePathPrefix?: string
    functionName?: string
    cookie?: CookieOptions
  }
}

export type Response = {
  statusCode?: number
  headers?: {
    [key: string]: string
  }
  body?: string | ReadableStream
  message?: string
}

export class HttpError extends Error {
  public readonly statusCode: number
  public override readonly message: string

  constructor({
    statusCode,
    message,
  }: {
    statusCode?: number
    message: string
  }) {
    super(message)

    if (Error.captureStackTrace) Error.captureStackTrace(this, HttpError)

    this.statusCode = statusCode || 500
    this.message = message
  }
}

const Name = 'http'

function stringToStream(text: string): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      try {
        const encoder = new TextEncoder()
        controller.enqueue(encoder.encode(text))
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })
}

function deepClone(obj: Record<string, any>) {
  if (obj === null || typeof obj !== 'object') return obj

  if (Array.isArray(obj)) return JSON.parse(JSON.stringify(obj))

  const clone: Record<string, any> = {}

  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) continue

    if (typeof obj[key] === 'function') {
      clone[key] = obj[key]
      continue
    }

    clone[key] = deepClone(obj[key])
  }

  return clone
}

function createCompressedStream(
  body: string,
  encoding: 'br' | 'gzip' | 'deflate'
): ReadableStream<Uint8Array> {
  const compressStream =
    encoding === 'br'
      ? createBrotliCompress()
      : encoding === 'gzip'
        ? createGzip()
        : createDeflate()

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const compressed = await new Promise<Buffer>((resolve, reject) => {
          const chunks: Buffer[] = []

          compressStream.on('data', (chunk: Buffer) => chunks.push(chunk))
          compressStream.on('end', () => resolve(Buffer.concat(chunks)))
          compressStream.on('error', reject)

          compressStream.write(Buffer.from(body))
          compressStream.end()
        })

        const chunkSize = 16 * 1024
        for (let i = 0; i < compressed.length; i += chunkSize) {
          controller.enqueue(compressed.subarray(i, i + chunkSize))
        }

        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })
}

export class Http<
  TParams extends Record<string, any> = any,
  TCookie extends Record<string, string> = any,
  TSession extends Record<string, string> = any,
> implements Plugin
{
  public readonly type = 'http'
  public readonly name: string = Name

  public headers: {
    [key: string]: string
  } = Object.create(null)
  public body: any

  public params: TParams = Object.create(null)
  public cookie: Cookie<TCookie, TSession>
  public session: Session<TSession, TCookie>
  public config: HttpConfig
  private response: Response

  constructor(config?: HttpConfig) {
    this.name = config?.name || this.type
    this.config = config?.config || Object.create(null)
  }

  public async onMount(data: MountData, next: Next): Promise<void> {
    data.logger.debug('merge config')

    const prefix = `SECRET_${this.name.toUpperCase()}_`

    for (let key in process.env)
      if (key.startsWith(prefix)) {
        const value = process.env[key]
        key = key.replace(prefix, '').toLowerCase()
        if (key.includes('_')) {
          let config = this.config
          const keys = key.split('_')
          for (const k of keys.slice(0, keys.length - 1)) {
            if (!config[k]) config[k] = Object.create(null)
            config = config[k]
          }
          config[keys[keys.length - 1] as string] = value
        } else this.config[key] = value
      }

    if (!data.config) throw Error(`[${this.name}] Config not found.`)

    if (data.config.plugins?.[this.name || this.type])
      this.config = deepMerge(
        this.config,
        data.config.plugins[this.name || (this.type as string)].config
      )

    data.logger.debug('prepare cookie & session')
    this.cookie = new Cookie(this.config.cookie || {}, data.logger)
    this.session = this.cookie.session

    await next()
  }

  public async onInvoke(data: InvokeData, next: Next): Promise<void> {
    this.headers = data.event.headers || Object.create(null)
    this.body = data.event.body
    this.params = data.event.queryString || Object.create(null)
    this.response = { headers: Object.create(null) }

    if (data.event.body) {
      if (
        this.headers['content-type']?.includes('application/json') &&
        typeof data.event.body === 'string' &&
        data.event.body.length > 1
      ) {
        data.logger.debug('Parse params from json body')
        try {
          this.params = Object.keys(this.params).length
            ? Object.assign(this.params, JSON.parse(data.event.body))
            : JSON.parse(data.event.body)
        } catch (error: any) {
          data.logger.error(
            'Parse params from json body failed: %s',
            error.message
          )
        }
      } else {
        data.logger.debug('Parse params from raw body')
        this.params = data.event.body || Object.create(null)
      }

      if (this.params && typeof this.params === 'object' && this.params._)
        delete (this.params as Record<string, any>)._

      data.event.params = deepClone(this.params)

      data.logger.debug('Params: %j', this.params)
    }

    data.params = data.event.params

    this.cookie.invoke(this.headers.cookie, data.logger)

    if (this.headers.cookie) {
      data.logger.debug('Cookie: %j', this.cookie.content)
      data.logger.debug(
        'Session: %s %j',
        this.session.config.key,
        this.session.content
      )
    }

    data.cookie = this.cookie
    data.session = this.session

    try {
      await next()
    } catch (error) {
      data.response = error
    }

    // update session
    this.session.update()

    // handle setBody case - merge this.response.body into data.response
    if (this.response.body && !data.response) {
      data.response = this.response.body
    }

    // generate body
    if (data.response)
      if (
        data.response instanceof Error ||
        data.response.constructor?.name === 'Error'
      ) {
        // generate error response
        data.logger.error(data.response)
        this.response.body = JSON.stringify({
          error: { message: data.response.message },
        })
        try {
          this.response.statusCode = data.response.statusCode || 500
        } catch (e: any) {
          data.logger.error(e)
          this.response.statusCode = 500
        }
      } else if (
        Object.prototype.toString.call(data.response) === '[object Object]' &&
        data.response.statusCode &&
        data.response.headers
      )
        // for directly response
        this.response = data.response
      else if (data.response instanceof ReadableStream)
        // for direct ReadableStream return
        this.response.body = data.response
      else
        this.response.body = JSON.stringify({
          data: data.response === undefined ? null : data.response,
        })

    // generate statusCode
    if (!this.response.statusCode)
      this.response.statusCode = data.response ? 200 : 204

    // generate headers
    this.response.headers = Object.assign(
      {
        'content-type':
          this.response.body instanceof ReadableStream
            ? 'text/plain; charset=utf-8'
            : 'application/json; charset=utf-8',
        'cache-control': 'no-cache, no-store',
        'x-faasjs-request-id': data.context.request_id,
      },
      this.cookie.headers(),
      this.response.headers
    )

    data.response = Object.assign({}, data.response, this.response)

    const originBody = data.response.body
    data.response.originBody = originBody

    if (data.response.body instanceof ReadableStream) {
      data.response.isBase64Encoded = true
      return
    }

    // If body is undefined and statusCode is 204, return without body
    if (originBody === undefined && data.response.statusCode === 204) {
      return
    }

    if (originBody && typeof originBody !== 'string')
      data.response.body = JSON.stringify(originBody)
    else if (originBody === undefined)
      data.response.body = JSON.stringify({ data: null })

    if (
      !data.response.body ||
      typeof data.response.body !== 'string' ||
      data.response.body.length < 1024
    ) {
      data.response.body = stringToStream(data.response.body as string)
      return
    }

    const acceptEncoding =
      this.headers['accept-encoding'] || this.headers['Accept-Encoding']
    if (!acceptEncoding || !/(br|gzip|deflate)/.test(acceptEncoding)) return

    try {
      const encoding: 'br' | 'gzip' | 'deflate' = acceptEncoding.includes('br')
        ? 'br'
        : acceptEncoding.includes('gzip')
          ? 'gzip'
          : 'deflate'

      data.response.headers['Content-Encoding'] = encoding
      data.response.body = createCompressedStream(originBody, encoding)
    } catch (error) {
      data.logger.error('Compression failed: %s', (error as Error).message)
      data.response.body = originBody
      delete data.response.headers['Content-Encoding']
    }
  }

  /**
   * set header
   * @param key {string} key
   * @param value {string} value
   */
  public setHeader(
    key: string,
    value: string
  ): Http<TParams, TCookie, TSession> {
    this.response.headers[key.toLowerCase()] = value
    return this
  }

  /**
   * set Content-Type
   * @param type {string} 类型
   * @param charset {string} 编码
   */
  public setContentType(
    type: string,
    charset = 'utf-8'
  ): Http<TParams, TCookie, TSession> {
    if (ContentType[type])
      this.setHeader('Content-Type', `${ContentType[type]}; charset=${charset}`)
    else this.setHeader('Content-Type', `${type}; charset=${charset}`)
    return this
  }

  /**
   * set status code
   * @param code {number} 状态码
   */
  public setStatusCode(code: number): Http<TParams, TCookie, TSession> {
    this.response.statusCode = code
    return this
  }

  /**
   * set body
   * @param body {*} 内容
   */
  public setBody(body: string): Http<TParams, TCookie, TSession> {
    this.response.body = body
    return this
  }
}

export function useHttp<
  TParams extends Record<string, any> = any,
  TCookie extends Record<string, string> = any,
  TSession extends Record<string, string> = any,
>(config?: HttpConfig): UseifyPlugin<Http<TParams, TCookie, TSession>> {
  return usePlugin(new Http<TParams, TCookie, TSession>(config))
}

declare module '@faasjs/func' {
  interface FaasPluginEventMap {
    http: {
      headers?: Record<string, any>
      body?: any
      params?: Record<string, any>
      queryString?: Record<string, any>
      httpMethod?: string
      path?: string
      raw?: {
        request?: unknown
        response?: unknown
      }
    }
  }
}
