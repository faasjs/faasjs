import { brotliDecompressSync, gunzipSync, inflateSync } from 'node:zlib'

import { Cookie, Http } from '@faasjs/core'
import type { Config, ExportedHandler, FuncEventType, Func } from '@faasjs/core'
import { loadPlugins, Logger } from '@faasjs/node-utils'
import { streamToString } from '@faasjs/utils'

function normalizeInferredPath(path: string): string {
  const normalized = path.replace(/\\/g, '/').replace(/\/+/g, '/')

  if (!normalized.length || normalized === '/') return '/'

  return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized
}

function inferPathFromFilename(filename: string): string | undefined {
  if (!filename) return undefined

  const normalized = filename.replace(/\\/g, '/')
  const srcIndex = normalized.lastIndexOf('/src/')

  if (srcIndex === -1) return undefined

  const relativeFile = normalized.slice(srcIndex + '/src/'.length)

  if (!relativeFile.endsWith('.api.ts')) return undefined
  if (/(^|\/)__tests__(\/|$)/.test(relativeFile)) return undefined

  const noTsPath = relativeFile.slice(0, -'.ts'.length)

  if (noTsPath === 'index.api' || noTsPath === 'default.api') return '/'

  if (noTsPath.endsWith('/index.api'))
    return normalizeInferredPath(`/${noTsPath.slice(0, -'/index.api'.length)}`)

  if (noTsPath.endsWith('/default.api'))
    return normalizeInferredPath(`/${noTsPath.slice(0, -'/default.api'.length)}`)

  if (noTsPath.endsWith('.api'))
    return normalizeInferredPath(`/${noTsPath.slice(0, -'.api'.length)}`)

  return undefined
}

type JsonHandlerBody<TApi extends Func<any, any, any>> =
  FuncEventType<TApi> extends {
    params?: infer TParams
  }
    ? 0 extends 1 & TParams
      ? Record<string, any> | string | null
      : TParams | string | null
    : Record<string, any> | string | null

type JsonHandlerOptions = {
  headers?: { [key: string]: any }
  path?: string
  cookie?: { [key: string]: any }
  session?: { [key: string]: any }
}

type JsonHandlerResult<TData = any> = {
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
}

type TestApiHandler<TApi extends Func<any, any, any>> = Pick<
  ApiTester<TApi>,
  'api' | 'config' | 'file' | 'handler' | 'JSONhandler' | 'logger' | 'mount' | 'staging'
> & {
  <TData = any>(
    body?: JsonHandlerBody<TApi>,
    options?: JsonHandlerOptions,
  ): Promise<JsonHandlerResult<TData>>
}

function createTester<TApi extends Func<any, any, any>>(api: TApi): ApiTester<TApi> {
  const tester = new ApiTester(api)

  tester.mount = tester.mount.bind(tester)
  tester.handler = tester.handler.bind(tester)
  tester.JSONhandler = tester.JSONhandler.bind(tester)

  return tester
}

/**
 * Wrap a FaasJS API with helpers for mounting and assertion-friendly invocations.
 *
 * The tester resolves config for the current `FaasEnv`, mounts lazily, and
 * exposes helpers for raw handler calls and HTTP-style JSON assertions.
 *
 * @template TApi - Wrapped FaasJS API type.
 * @see {@link testApi}
 * @example
 * ```ts
 * import { ApiTester } from '@faasjs/dev'
 * import api from './hello.api.ts'
 *
 * const wrapped = new ApiTester(api)
 *
 * const response = await wrapped.JSONhandler({ name: 'FaasJS' })
 * ```
 */
export class ApiTester<TApi extends Func<any, any, any> = Func<any, any, any>> {
  /**
   * Source file path inferred from the wrapped API.
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
   * Wrapped API instance.
   */
  public readonly api: TApi
  /**
   * Resolved config attached to the wrapped API.
   */
  public readonly config: Config
  private readonly _handler: ExportedHandler
  private readonly inferredPath: string | undefined
  private readonly loadPluginsTask?: Promise<void>

  /**
   * Create a tester around a FaasJS API instance for repeated test calls.
   *
   * @param {TApi} api - API instance to wrap.
   * @example
   * ```ts
   * import { ApiTester } from '@faasjs/dev'
   * import api from './hello.api.ts'
   *
   * const wrapped = new ApiTester(api)
   * ```
   */
  constructor(api: TApi) {
    this.staging = process.env.FaasEnv ?? 'default'
    this.logger = new Logger('TestCase')

    this.api = api
    if (this.api.filename)
      this.loadPluginsTask = loadPlugins(this.api, {
        root: process.cwd(),
        filename: this.api.filename,
        staging: this.staging,
        logger: this.logger,
      }).then(() => undefined)

    this.file = this.api.filename || ''
    this.config = this.api.config
    this.inferredPath = inferPathFromFilename(this.file)

    this._handler = this.api.export().handler
  }

  /**
   * Mount the wrapped API once before running assertions.
   *
   * @param {(api: ApiTester<TApi>) => Promise<void> | void} [handler] - Optional callback invoked after mount.
   * @returns Resolves after the API has been mounted and the callback has finished.
   */
  public async mount(handler?: (api: ApiTester<TApi>) => Promise<void> | void): Promise<void> {
    if (this.loadPluginsTask) await this.loadPluginsTask

    if (!this.api.mounted) {
      await this.api.mount()
    }

    if (handler) await handler(this)
  }

  /**
   * Invoke the wrapped API with raw event and context payloads.
   *
   * @template TResult - Expected response type returned by the handler.
   * @param {Record<string, unknown>} [event] - Runtime event passed to the exported handler.
   * @param {Record<string, unknown>} [context] - Runtime context passed to the exported handler.
   * @returns {Promise<TResult>} Handler result.
   */
  public async handler<TResult = any>(
    event: Record<string, unknown> = Object.create(null),
    context: Record<string, unknown> = Object.create(null),
  ): Promise<TResult> {
    await this.mount()

    const response = await this._handler(event, context)
    this.logger.debug('response: %j', response)

    return response
  }

  /**
   * Invoke an HTTP-enabled API with JSON body helpers and decoded cookies.
   *
   * JSON responses populate `data` and `error`, while `Set-Cookie` headers are
   * decoded into the returned `cookie` and `session` objects.
   *
   * @template TData - Expected JSON `data` payload returned by the API.
   * @param {JsonHandlerBody<TApi>} [body] - Request body object or raw JSON string.
   * @param {object} [options] - Extra headers, request cookies, and session seed values.
   * @param {Record<string, any>} [options.headers] - Extra request headers merged into the JSON test request.
   * @param {string} [options.path] - Request path attached to `event.path` during invocation. This path is the URL pathname without the query string. Defaults to the inferred path from the wrapped API filename when available.
   * @param {Record<string, any>} [options.cookie] - Cookie key-value pairs preloaded into the request.
   * @param {Record<string, any>} [options.session] - Session key-value pairs encoded into the request cookie before invocation.
   * @returns Normalized HTTP response payload for assertions.
   * @throws {Error} When the wrapped API does not use the HTTP plugin.
   * @example
   * ```ts
   * import { testApi } from '@faasjs/dev'
   * import api from './hello.api.ts'
   *
   * const handler = testApi(api)
   * const response = await handler({ name: 'FaasJS' }, { session: { userId: '1' } })
   *
   * expect(response.data).toEqual({ message: 'Hello, FaasJS' })
   * ```
   */
  public async JSONhandler<TData = any>(
    body?: JsonHandlerBody<TApi>,
    options: JsonHandlerOptions = Object.create(null),
  ): Promise<JsonHandlerResult<TData>> {
    await this.mount()

    const headers = options.headers || Object.create(null)
    let requestCookieHeader = headers.cookie

    const http = this.api.plugins.find((plugin) => plugin instanceof Http)

    if (!http) throw new Error('No Http plugin found in the API')

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
      path: options.path ?? this.inferredPath,
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
        response.body = await streamToString(stream)
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
 * Create a callable JSON test handler around a FaasJS API.
 *
 * The returned function forwards to {@link ApiTester.JSONhandler} so it keeps
 * the same `(body, options?)` calling style while still exposing bound tester
 * methods for advanced cases.
 *
 * @template TApi - Wrapped FaasJS API type.
 * @param {TApi} api - API instance to wrap.
 * @returns Callable JSON test helper with bound tester methods attached.
 * @see {@link ApiTester}
 * @example
 * ```ts
 * import { testApi } from '@faasjs/dev'
 * import api from './hello.api.ts'
 *
 * const handler = testApi(api)
 * const response = await handler({ name: 'FaasJS' }, { session: { userId: '1' } })
 *
 * expect(response.data).toEqual({ message: 'Hello, FaasJS' })
 * ```
 */
export function testApi<TApi extends Func<any, any, any>>(api: TApi): TestApiHandler<TApi> {
  const tester = createTester(api)

  return Object.assign(
    async <TData = any>(
      body?: JsonHandlerBody<TApi>,
      options: JsonHandlerOptions = Object.create(null),
    ) => tester.JSONhandler<TData>(body, options),
    {
      config: tester.config,
      file: tester.file,
      api: tester.api,
      handler: tester.handler,
      JSONhandler: tester.JSONhandler,
      logger: tester.logger,
      mount: tester.mount,
      staging: tester.staging,
    },
  ) as TestApiHandler<TApi>
}
