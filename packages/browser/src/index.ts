export interface Params {
  [key: string]: any
}

export interface Options {
  beforeRequest?: ({
    action, params, xhr
  }: {
    action: string
    params: Params
    xhr: XMLHttpRequest
  }) => void
}

export interface ResponseHeaders {
  [key: string]: string
}

export class Response<T = any> {
  public readonly status: number
  public readonly headers: ResponseHeaders
  public readonly data: T

  constructor ({
    status, headers, data
  }: {
    status: number
    headers: ResponseHeaders
    data: T
  }) {
    this.status = status
    this.headers = headers
    this.data = data
  }
}

export class ResponseError extends Error {
  public readonly status: number
  public readonly headers: ResponseHeaders
  public readonly body: any

  constructor ({
    message, status, headers, body
  }: {
    message: string; status: number; headers: ResponseHeaders; body: any;
  }) {
    super(message)

    this.status = status
    this.headers = headers
    this.body = body
  }
}

export class FaasBrowserClient {
  public host: string
  public defaultOptions: Options

  /**
   * 创建 FaasJS 浏览器客户端
   * @param baseUrl {string} 网关地址
   * @param options {object} 默认配置项
   */
  constructor (baseUrl: string, options?: Options) {
    this.host = baseUrl[baseUrl.length - 1] === '/' ? baseUrl : baseUrl + '/'
    this.defaultOptions = options || Object.create(null)

    console.debug('[faas] baseUrl: ' + this.host)
  }

  /**
   * 发起请求
   * @param action {string} 动作名称
   * @param params {any} 动作参数
   * @param options {object} 默认配置项
   */
  public async action<T = any> (
    action: string,
    params: Params,
    options: Options = {}
  ): Promise<Response<T>> {
    const url = this.host + action.toLowerCase() + '?_=' + new Date().getTime().toString()

    options = {
      ...this.defaultOptions,
      ...options
    }

    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', url)
      xhr.withCredentials = true
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
      if (options.beforeRequest)
        options.beforeRequest({
          action,
          params,
          xhr
        })

      xhr.onload = function () {
        let res = xhr.response
        const headersList = xhr.getAllResponseHeaders().trim().split(/[\r\n]+/)
        const headers: ResponseHeaders = {}
        headersList.forEach(function (line) {
          const parts = line.split(': ')
          const key = parts.shift()
          const value = parts.join(': ')
          if (key)
            headers[key] = value
        })
        if (xhr.response && xhr.getResponseHeader('Content-Type')?.includes('json'))
          try {
            res = JSON.parse(xhr.response)
            if (res.error && res.error.message)
              reject(new ResponseError({
                message: res.error.message,
                status: xhr.status,
                headers,
                body: res
              }))
          } catch (error) {
            console.error(error)
          }

        if (xhr.status >= 200 && xhr.status < 300)
          resolve(new Response({
            status: xhr.status,
            headers,
            data: res.data
          }))
        else {
          console.error(xhr, res)
          reject(new ResponseError({
            message: xhr.statusText || xhr.status.toString(),
            status: xhr.status,
            headers,
            body: res
          }))
        }
      }

      xhr.onerror = function () {
        reject(new ResponseError({
          message: 'Network Error',
          status: xhr.status,
          headers: {},
          body: null
        }))
      }

      xhr.send(JSON.stringify(params))
    })
  }
}

export default FaasBrowserClient
