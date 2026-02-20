import { brotliDecompressSync, gunzipSync, inflateSync } from 'node:zlib'
import { Http } from '@faasjs/core'
import type { Config, ExportedHandler, Func, Plugin } from '@faasjs/func'
import {
  deepMerge,
  loadConfig,
  Logger,
  streamToObject,
  streamToString,
  streamToText,
} from '@faasjs/node-utils'

export * from '@faasjs/func'

export { streamToObject, streamToString, streamToText }

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
export class FuncWarper {
  [key: string]: any
  public readonly file: string
  public readonly staging: string
  public readonly logger: Logger
  public readonly func: Func
  public readonly config: Config
  public readonly plugins: Plugin[]
  private readonly _handler: ExportedHandler

  /**
   * @param initBy {Func} A FaasJS function
   * ```ts
   * import { FuncWarper } from '@faasjs/dev'
   *
   * new FuncWarper(__dirname + '/../demo.func.ts')
   * ```
   */
  constructor(initBy: Func) {
    this.staging = process.env.FaasEnv ?? 'default'
    this.logger = new Logger('TestCase')

    this.func = initBy.default ? initBy.default : initBy
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

  public async mount(handler?: (func: FuncWarper) => Promise<void> | void): Promise<void> {
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
    body?: Record<string, any> | string | null,
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

    if (this.http && this.http instanceof Http) {
      if (options.cookie)
        for (const key in options.cookie) this.http.cookie.write(key, options.cookie[key])

      if (options.session) {
        for (const key in options.session) this.http.session.write(key, options.session[key])
        this.http.session.update()
      }
      const cookie = this.http.cookie
        .headers()
        ['Set-Cookie']?.map((c: string) => c.split(';')[0])
        .join(';')
      if (cookie)
        if (headers.cookie) headers.cookie += `;${cookie}`
        else headers.cookie = cookie
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

    if (this.http) {
      response.cookie = this.http.cookie.content
      response.session = this.http.session.content
    }

    this.logger.debug('response: %j', response)

    return response
  }
}

/**
 * A simple way to wrap a FaasJS function.
 * @param initBy {Func} Full file path or a FaasJs function
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
export function test(initBy: Func): FuncWarper {
  const warper = new FuncWarper(initBy)

  warper.mount = warper.mount.bind(warper)
  warper.handler = warper.handler.bind(warper)
  warper.JSONhandler = warper.JSONhandler.bind(warper)

  return warper
}
