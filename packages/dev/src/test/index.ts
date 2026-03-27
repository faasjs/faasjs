import { brotliDecompressSync, gunzipSync, inflateSync } from 'node:zlib'

import { Cookie, Http } from '@faasjs/core'
import type { Config, ExportedHandler, Func, FuncEventType } from '@faasjs/core'
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
 * @template TFunc - Wrapped FaasJS function type.
 *
 * @example
 * ```ts
 * import { FuncWarper } from '@faasjs/dev'
 * import { func } from './hello.func'
 *
 * const wrapped = new FuncWarper(func)
 *
 * const response = await wrapped.JSONhandler({ name: 'FaasJS' })
 * ```
 */
export class FuncWarper<TFunc extends Func<any, any, any> = Func<any, any, any>> {
  /**
   * Source file path inferred from the wrapped function.
   */
  public readonly file: string
  /**
   * Active staging name used while loading config.
   */
  public readonly staging: string
  /**
   * Logger used by helper methods.
   */
  public readonly logger: Logger
  /**
   * Wrapped function instance.
   */
  public readonly func: TFunc
  /**
   * Resolved config attached to the wrapped function.
   */
  public readonly config: Config
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

    this._handler = this.func.export().handler
  }

  /**
   * Mount the wrapped function once before running assertions.
   *
   * @param handler - Optional callback invoked after mount.
   */
  public async mount(handler?: (func: FuncWarper<TFunc>) => Promise<void> | void): Promise<void> {
    if (!this.func.mounted) {
      await this.func.mount()
    }

    if (handler) await handler(this)
  }

  /**
   * Invoke the wrapped function with raw event and context payloads.
   *
   * @template TResult - Expected response type returned by the handler.
   * @param event - Runtime event to pass to the exported handler.
   * @param context - Runtime context to pass to the exported handler.
   * @returns Handler result.
   */
  public async handler<TResult = any>(
    event: any = Object.create(null),
    context: any = Object.create(null),
  ): Promise<TResult> {
    await this.mount()

    const response = await this._handler(event, context)
    this.logger.debug('response: %j', response)

    return response
  }

  /**
   * Invoke an HTTP-enabled function with JSON body helpers and decoded cookies.
   *
   * @template TData - Expected JSON `data` payload returned by the function.
   * @param body - Request body object or raw JSON string.
   * @param options - Extra headers, request cookies, and session seed values.
   * @returns Normalized HTTP response payload for assertions.
   * @throws {Error} When the wrapped function does not use the HTTP plugin.
   */
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

    const http = this.func.plugins.find((plugin) => plugin instanceof Http)

    if (!http) throw new Error('No Http plugin found in the function')

    const cookie = new Cookie(http.config.cookie || {}, this.logger).invoke(
      requestCookieHeader,
      this.logger,
    )

    if (options.cookie) {
      for (const key in options.cookie) cookie.write(key, options.cookie[key])
    }

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

    const setCookieHeaders = response?.headers?.['Set-Cookie'] || response?.headers?.['set-cookie']
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

    this.logger.debug('response: %j', response)

    return response
  }
}

/**
 * Create a {@link FuncWarper} for tests.
 *
 * @template TFunc - Wrapped FaasJS function type.
 * @param initBy - FaasJS function module or exported function instance.
 *
 * @example
 * ```ts
 * import { test } from '@faasjs/dev'
 * import { func } from './hello.func'
 *
 * const wrapped = test(func)
 *
 * const response = await wrapped.JSONhandler({ name: 'FaasJS' })
 * ```
 */
export function test<TFunc extends Func<any, any, any>>(initBy: TFunc): FuncWarper<TFunc> {
  const warper = new FuncWarper(initBy)

  warper.mount = warper.mount.bind(warper)
  warper.handler = warper.handler.bind(warper)
  warper.JSONhandler = warper.JSONhandler.bind(warper)

  return warper
}
