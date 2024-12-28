import { deepMerge } from '@faasjs/deep_merge'
import type { Config, ExportedHandler, Func, Plugin } from '@faasjs/func'
import type { Http } from '@faasjs/http'
import { loadConfig } from '@faasjs/load'

/**
 * FaasJS's testing module.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/test.svg)](https://github.com/faasjs/faasjs/blob/main/packages/test/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/test.svg)](https://www.npmjs.com/package/@faasjs/test)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/test
 * ```
 * @packageDocumentation
 */
import { Logger } from '@faasjs/logger'

export * from '@faasjs/func'

/**
 * Test Wrapper for a func
 *
 * ```ts
 * import { FuncWarper } from '@faasjs/test'
 *
 * const func = new FuncWarper(__dirname + '/../demo.func.ts')
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
   * @param file {string} Full file path
   * @param func {Func} A FaasJs function
   * ```ts
   * import { FuncWarper } from '@faasjs/test'
   *
   * new FuncWarper(__dirname + '/../demo.func.ts')
   * ```
   */
  constructor(initBy: Func)
  constructor(initBy: string)
  constructor(initBy: any)
  constructor(initBy: any) {
    this.staging = process.env.FaasEnv
    this.logger = new Logger('TestCase')

    if (typeof initBy === 'string') {
      this.file = initBy
      this.logger.info('Func: [%s] %s', this.staging, this.file)

      try {
        this.func = require(this.file).default
      } catch (_) {
        this.func = require(`${this.file}.ts`).default
      }

      this.func.config = loadConfig(
        process.cwd(),
        this.file,
        this.staging,
        this.logger
      )
      this.logger.debug('config: %j', this.func.config)
      this.config = this.func.config
    } else {
      this.func = initBy.default ? initBy.default : initBy
      if (this.func.filename)
        this.func.config = deepMerge(
          loadConfig(process.cwd(), initBy.filename, this.staging, this.logger),
          initBy.config
        )
    }

    this.plugins = this.func.plugins || []
    for (const plugin of this.plugins) {
      if (
        ['handler', 'config', 'plugins', 'logger', 'mount'].includes(
          plugin.type
        )
      )
        continue
      this[plugin.type] = plugin
    }

    this._handler = this.func.export().handler
  }

  public async mount(
    handler?: (func: FuncWarper) => Promise<void> | void
  ): Promise<void> {
    if (!this.func.mounted) await this.func.mount()

    if (handler) await handler(this)
  }

  public async handler<TResult = any>(
    event: any = Object.create(null),
    context: any = Object.create(null)
  ): Promise<TResult> {
    await this.mount()

    const response = await this._handler(event, context)
    this.logger.debug('response: %j', response)

    return response
  }

  public async JSONhandler<TData = any>(
    body?: { [key: string]: any },
    options: {
      headers?: { [key: string]: any }
      cookie?: { [key: string]: any }
      session?: { [key: string]: any }
    } = Object.create(null)
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

    const http: Http = this.http
    if (http) {
      if (options.cookie)
        for (const key in options.cookie)
          http.cookie.write(key, options.cookie[key])

      if (options.session) {
        for (const key in options.session)
          http.session.write(key, options.session[key])
        http.session.update()
      }
      const cookie = http.cookie
        .headers()
      ['Set-Cookie']?.map(c => c.split(';')[0])
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

    if (
      response?.headers &&
      response.body &&
      response.headers['content-type']?.includes('json')
    ) {
      const parsedBody = JSON.parse(response.body)
      response.data = parsedBody.data
      response.error = parsedBody.error
    }

    if (http) {
      response.cookie = http.cookie.content
      response.session = http.session.content
    }

    this.logger.debug('response: %j', response)

    return response
  }
}

/**
 * A simple way to warp a FaasJS function.
 * @param initBy {string | Func} Full file path or a FaasJs function
 *
 * ```ts
 * import { test } from '@faasjs/test'
 *
 * const func = test(__dirname + '/../demo.func.ts')
 *
 * expect(await func.handler()).toEqual('Hello, world')
 * ```
 */
export function test(initBy: Func | string): FuncWarper {
  const warper = new FuncWarper(initBy as string)

  warper.mount = warper.mount.bind(warper)
  warper.handler = warper.handler.bind(warper)
  warper.JSONhandler = warper.JSONhandler.bind(warper)

  return warper
}
