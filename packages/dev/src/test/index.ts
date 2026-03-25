import { brotliDecompressSync, gunzipSync, inflateSync } from 'node:zlib'

import { Cookie, Http } from '@faasjs/core'
import type { Config, ExportedHandler, Func, FuncEventType, Plugin } from '@faasjs/core'
import {
  deepMerge,
  loadConfig,
  Logger,
  streamToObject,
  streamToString,
  streamToText,
} from '@faasjs/node-utils'

export * from '@faasjs/core'

export { streamToObject, streamToString, streamToText }

type IsAny<T> = 0 extends 1 & T ? true : false
type JSONhandlerBody<TFunc extends Func<any, any, any>> =
  FuncEventType<TFunc> extends {
    params?: infer TParams
  }
    ? IsAny<TParams> extends true
      ? Record<string, any> | string | null
      : TParams | string | null
    : Record<string, any> | string | null

/**
 * Test wrapper for a function.
 *
 * ```ts
 * import { FuncWarper } from '@faasjs/dev'
 * import Func from '../demo.func.ts'
 *
 * const func = new FuncWarper(Func)
 *
 * expect(await func.handler()).toEqual('Hello, world')
 * ```
 */
export class FuncWarper<TFunc extends Func<any, any, any> = Func<any, any, any>> {
  [key: string]: any
  public readonly file: string
  public readonly staging: string
  public readonly logger: Logger
  public readonly func: TFunc
  public readonly config: Config
  public readonly plugins: Plugin[]
  private readonly _handler: ExportedHandler

  /**
   * Create a test wrapper around a FaasJS function module.
   *
   * @param initBy - FaasJS function module or exported function instance.
   * ```ts
   * import { FuncWarper } from '@faasjs/dev'
   *
   * new FuncWarper(__dirname + '/../demo.func.ts')
   * ```
   */
  constructor(initBy: TFunc) {
    this.staging = process.env.FaasEnv ?? 'default'
    this.logger = new Logger('TestCase')

    this.func = (initBy.default ? initBy.default : initBy) as TFunc
    if (this.func.filename)
      this.func.config = deepMerge(
        loadConfig(process.cwd(), this.func.filename, this.staging, this.logger),
        this.func.config,
      )

    this.file = this.func.filename || ''
    this.config = this.func.config

    this.plugins = this.func.plugins || []
    for (const plugin of this.plugins) {
      if (['handler', 'config', 'plugins', 'logger', 'mount'].includes(plugin.type)) continue
      this[plugin.type] = plugin
    }

    this._handler = this.func.export().handler
  }

  public async mount(handler?: (func: FuncWarper<TFunc>) => Promise<void> | void): Promise<void> {
    if (!this.func.mounted) await this.func.mount()

    if (handler) await handler(this)
  }

  public async handler<TResult = any>(
    event: any = Object.create(null),
    context: any = Object.create(null),
  ): Promise<TResult> {
    await this.mount()

    const response = await this._handler(event, context)
    this.logger.debug('response: %j', response)

    return response
  }

  public async JSONhandler<TData = any>(
    body?: JSONhandlerBody<TFunc>,
    options: {
      headers?: { [key: string]: any }
      cookie?: { [key: string]: any }
      session?: { [key: string]: any }
    } = Object.create(null),
  ): Promise<{
    statusCode: number
    headers: {
      [key: string]: string
    }
    cookie?: Record<string, any>
    session?: Record<string, any>
    body: any
    data?: TData
    error?: {
      message: string
    }
  }> {
    await this.mount()

    const headers = options.headers || Object.create(null)
    let requestCookieHeader = headers.cookie

    if (this.http && this.http instanceof Http) {
      const cookie = new Cookie(this.http.config.cookie || {}, this.logger).invoke(
        headers.cookie,
        this.logger,
      )

      if (options.cookie) for (const key in options.cookie) cookie.write(key, options.cookie[key])

      if (options.session) {
        for (const key in options.session) cookie.session.write(key, options.session[key])
        cookie.session.update()
      }

      const mergedCookie = cookie
        .headers()
        ['Set-Cookie']?.map((item: string) => item.split(';')[0])
        .join(';')

      if (mergedCookie)
        if (headers.cookie) headers.cookie += `;${mergedCookie}`
        else headers.cookie = mergedCookie

      requestCookieHeader = headers.cookie
    }

    const response = await this._handler({
      httpMethod: 'POST',
      headers: Object.assign({ 'content-type': 'application/json' }, headers),
      body: typeof body === 'string' ? body : JSON.stringify(body),
    })

    if (response?.body instanceof ReadableStream) {
      let stream: ReadableStream<Uint8Array> = response.body

      const encoding =
        response.headers?.['Content-Encoding'] || response.headers?.['content-encoding']

      if (encoding) {
        const chunks: Uint8Array[] = []
        const reader = stream.getReader()

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            if (value) chunks.push(value)
          }
        } catch (error) {
          this.logger.error('Failed to read ReadableStream: %s', error)
          response.body = JSON.stringify({
            error: { message: (error as Error).message },
          })
          response.error = { message: (error as Error).message }
          response.statusCode = 500
          reader.releaseLock()
          return response
        }

        reader.releaseLock()

        const compressedBuffer = Buffer.concat(chunks)

        try {
          let decompressed: Buffer
          if (encoding === 'br') {
            decompressed = brotliDecompressSync(compressedBuffer)
          } else if (encoding === 'gzip') {
            decompressed = gunzipSync(compressedBuffer)
          } else if (encoding === 'deflate') {
            decompressed = inflateSync(compressedBuffer)
          } else {
            throw new Error(`Unsupported encoding: ${encoding}`)
          }

          stream = new ReadableStream<Uint8Array>({
            start(controller) {
              controller.enqueue(new Uint8Array(decompressed))
              controller.close()
            },
          })
        } catch (error) {
          this.logger.error('Failed to decompress: %s', error)
          response.body = JSON.stringify({
            error: { message: (error as Error).message },
          })
          response.error = { message: (error as Error).message }
          response.statusCode = 500
          return response
        }
      }

      try {
        response.body = await streamToText(stream)
      } catch (error) {
        this.logger.error('Failed to decode ReadableStream: %s', error)
        response.body = JSON.stringify({
          error: { message: (error as Error).message },
        })
        response.error = { message: (error as Error).message }
        response.statusCode = 500
      }
    }

    if (response?.headers && response.body && response.headers['content-type']?.includes('json')) {
      const parsedBody = JSON.parse(response.body)
      response.data = parsedBody.data
      response.error = parsedBody.error
    }

    if (this.http && this.http instanceof Http) {
      const cookie = new Cookie(this.http.config.cookie || {}, this.logger).invoke(
        requestCookieHeader,
        this.logger,
      )
      const setCookieHeaders =
        response?.headers?.['Set-Cookie'] || response?.headers?.['set-cookie']
      const cookies = Array.isArray(setCookieHeaders)
        ? setCookieHeaders
        : typeof setCookieHeaders === 'string'
          ? [setCookieHeaders]
          : []

      for (const setCookie of cookies) {
        const matched = /^([^=]+)=([^;]*)/.exec(setCookie)

        if (!matched) continue

        const key = matched[1]
        const value = decodeURIComponent(matched[2] || '')
        const expired =
          /(?:^|;)\s*expires=Thu, 01 Jan 1970 00:00:01 GMT/i.test(setCookie) ||
          /(?:^|;)\s*max-age=0/i.test(setCookie)

        if (expired) delete cookie.content[key]
        else cookie.content[key] = value
      }

      cookie.session.invoke(cookie.read(cookie.session.config.key), this.logger)

      response.cookie = cookie.content
      response.session = cookie.session.content
    }

    this.logger.debug('response: %j', response)

    return response
  }
}

/**
 * Create a {@link FuncWarper} for tests.
 *
 * @param initBy - FaasJS function module or exported function instance.
 *
 * ```ts
 * import { test } from '@faasjs/dev'
 * import Func from '../demo.func.ts'
 *
 * const func = test(Func)
 *
 * expect(await func.handler()).toEqual('Hello, world')
 * ```
 */
export function test<TFunc extends Func<any, any, any>>(initBy: TFunc): FuncWarper<TFunc> {
  const warper = new FuncWarper(initBy)

  warper.mount = warper.mount.bind(warper)
  warper.handler = warper.handler.bind(warper)
  warper.JSONhandler = warper.JSONhandler.bind(warper)

  return warper
}
