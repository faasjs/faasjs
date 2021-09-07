import Logger from '@faasjs/logger'
import {
  Func, ExportedHandler, Plugin, Config
} from '@faasjs/func'
import { loadConfig } from '@faasjs/load'
import { Http } from '@faasjs/http'
import { NodeVM } from 'vm2'
import { transpile } from 'typescript'
import deepMerge from '@faasjs/deep_merge'

// 输出 func 的定义以便于测试用例的引用
export * from '@faasjs/func'

/**
 * 自动化测试用的云函数实例
 */
export class FuncWarpper {
  [key: string]: any;
  public readonly file: string
  public readonly stagging: string
  public readonly logger: Logger
  public readonly func: Func
  public readonly config: Config
  public readonly plugins: Plugin[]
  private readonly _handler: ExportedHandler
  private _vm: NodeVM

  /**
   * 新建流程实例
   * @param file {string} 文件名，必须是完整文件名，建议使用 require.resolve() 来传入
   * @param func {Func} 云函数实例
   * @example new TestCase(require.resolve('../demo.flow.ts'))
   */
  constructor (func: Func)
  constructor (file: string)
  constructor (initBy: Func | string) {
    this.stagging = process.env.FaasEnv
    this.logger = new Logger('TestCase')
    this._vm = new NodeVM({
      compiler: function (code: string, name: string ) { return transpile(code, {}, name)},
      require: {
        external: true,
        context: 'sandbox',
        builtin: ['*']
      },
      sourceExtensions: ['ts', 'js']
    })

    if (typeof initBy === 'string') {
      this.file = initBy
      this.logger.info('Func: [%s] %s', this.stagging, this.file)
      // try {
      //   this.func = this._vm.require(this.file).default
      // } catch (error) {
      //   console.error(error)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      this.func = require(this.file).default
      // }
      this.func.config = loadConfig(process.cwd(), this.file)[this.stagging]
      this.config = this.func.config
    } else {
      this.func = initBy
      if (initBy.filename)
        this.func.config = deepMerge(
          loadConfig(process.cwd(), initBy.filename)[this.stagging],
          initBy.config
        )
    }

    this.plugins = this.func.plugins || []
    for (const plugin of this.plugins) {
      if ([
        'handler',
        'config',
        'plugins',
        'logger',
        'mount'
      ].includes(plugin.type)) continue
      this[plugin.type] = plugin
    }

    this._handler = this.func.export().handler
  }

  public async mount (handler?: ((func: FuncWarpper) => Promise<void> | void)): Promise<void> {
    if (!this.func.mounted)
      await this.func.mount({
        event: {},
        context: {}
      })


    if (handler) await handler(this)
  }

  public async handler<TResult = any> (event: any = Object.create(null), context: any = Object.create(null)): Promise<TResult> {
    await this.mount()

    const response = await this._handler(event, context)
    this.logger.debug('response: %O', response)

    return response
  }

  public async JSONhandler<TData = any> (body?: { [key: string]: any }, options: {
    headers?: { [key: string]: any }
    cookie?: { [key: string]: any }
    session?: { [key: string]: any }
  } = Object.create(null)): Promise<{
      statusCode: number
      headers: {
        [key: string]: string
      }
      body: any
      data?: TData
      error?: {
        message: string
      }
    }> {
    await this.mount()

    const headers = (options.headers) || Object.create(null)

    const http: Http = this.http
    if (http) {
      if (options.cookie)
        for (const key in options.cookie) http.cookie.write(key, options.cookie[key])

      if (options.session) {
        for (const key in options.session) http.session.write(key, options.session[key])
        http.session.update()
      }
      const cookie = http.cookie.headers()['Set-Cookie']?.map(c => c.split(';')[0]).join(';')
      if (cookie)
        if (headers.cookie) headers.cookie += ';' + cookie
        else headers.cookie = cookie
    }

    const response = await this._handler({
      httpMethod: 'POST',
      headers: Object.assign({ 'content-type': 'application/json' }, headers),
      body: typeof body === 'string' ? body : JSON.stringify(body)
    })

    if (response && response.headers && response.body && response.headers['Content-Type']?.includes('json')) {
      const parsedBody = JSON.parse(response.body)
      response.data = parsedBody.data
      response.error = parsedBody.error
    }

    this.logger.debug('response: %O', response)

    return response
  }
}
