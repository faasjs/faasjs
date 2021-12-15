export type Params = {
  [key: string]: any
}

export type Options = RequestInit & {
  headers?: {
    [key: string]: string
  }
  beforeRequest?: ({
    action, params, options
  }: {
    action: string
    params: Params
    options: Options
  }) => Promise<void> | void
}

export type ResponseHeaders = {
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
    data?: T
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

    console.debug('[FaasJS] baseUrl: ' + this.host)
  }

  /**
   * 发起请求
   * @param action {string} 动作名称
   * @param params {any} 动作参数
   * @param options {object} 默认配置项
   */
  public async action<T = any> (
    action: string,
    params: Params = {},
    options: Options = {}
  ): Promise<Response<T>> {
    const url = this.host + action.toLowerCase() + '?_=' + new Date().getTime().toString()

    options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      mode: 'cors',
      body: JSON.stringify(params),
      ...this.defaultOptions,
      ...options
    }

    if (options.beforeRequest)
      await options.beforeRequest({
        action,
        params,
        options
      })

    return fetch(url, options)
      .then( async response => {
        const headers: {
          [key: string]: string
        } = {}
        response.headers.forEach((value, key) => headers[key] = value)

        return response.json().then(res => {
          if (!res)
            return new Response({
              status: response.status,
              headers
            })

          if (res.error && res.error.message)
            return Promise.reject(new ResponseError({
              message: res.error.message,
              status: response.status,
              headers,
              body: response
            }))
          else
            return new Response({
              status: response.status,
              headers,
              data: res.data
            })
        })
      })
  }
}

export default FaasBrowserClient
