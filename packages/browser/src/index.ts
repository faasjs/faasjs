import {
  FaasAction, FaasData, FaasParams
} from '@faasjs/types'

export type Options = RequestInit & {
  headers?: {
    [key: string]: string
  }
  beforeRequest?: ({
    action, params, options
  }: {
    action: string
    params: Record<string, any>
    options: Options
  }) => Promise<void> | void
}

export type ResponseHeaders = {
  [key: string]: string
}

export type FaasBrowserClientAction = <PathOrData extends FaasAction> (
  action: PathOrData | string,
  params?: FaasParams<PathOrData>,
  options?: Options
) => Promise<Response<FaasData<PathOrData>>>

/**
 * Response class
 *
 * Example:
 * ```ts
 * new Response({
 *   status: 200,
 *   data: {
 *     name: 'FaasJS'
 *   }
 * })
 * ```
 */
export class Response<T = any> {
  public readonly status: number
  public readonly headers: ResponseHeaders
  public readonly body: any
  public readonly data: T

  constructor ({
    status, headers, body, data
  }: {
    status: number
    headers: ResponseHeaders
    body?: any
    data?: T
  }) {
    this.status = status
    this.headers = headers
    this.body = body
    this.data = data
  }
}

/**
 * ResponseError class
 *
 * Example:
 * ```ts
 * new ResponseError({
 *   status: 404,
 *   message: 'Not Found',
 * })
 * ```
 */
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

/**
 * FaasJS browser client
 *
 * Example:
 *
 * ```ts
 * new FaasBrowserClient({
 *   baseURL: 'http://localhost:8080'
 * })
 * ```
 */
export class FaasBrowserClient {
  public host: string
  public defaultOptions: Options

  /**
   * Create FaasJS Client
   * @param baseUrl
   * @param options default options
   */
  constructor (baseUrl: string, options?: Options) {
    if (!baseUrl) throw Error('[FaasJS] baseUrl required')

    this.host = baseUrl[baseUrl.length - 1] === '/' ? baseUrl : baseUrl + '/'
    this.defaultOptions = options || Object.create(null)

    console.debug('[FaasJS] Initialize with baseUrl: ' + this.host)
  }

  /**
   * Request a FaasJS function
   * @param action function path
   * @param params function params
   * @param options request options
   */
  public async action<PathOrData extends FaasAction> (
    action: PathOrData | string,
    params?: FaasParams<PathOrData>,
    options?: Options
  ): Promise<Response<FaasData<PathOrData>>> {
    const url = this.host + (action as string).toLowerCase() + '?_=' + Date.now().toString()

    if (!params) params = Object.create(null)
    if (!options) options = Object.create(null)

    options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(params),
      ...this.defaultOptions,
      ...options
    }

    if (options.beforeRequest)
      await options.beforeRequest({
        action: action as string,
        params,
        options
      })

    return fetch(url, options)
      .then( async response => {
        const headers: {
          [key: string]: string
        } = {}
        response.headers.forEach((value, key) => headers[key] = value)

        return response.text().then(res => {
          if (response.status >= 200 && response.status < 300) {
            if (!res)
              return new Response({
                status: response.status,
                headers
              })
            else {
              const body = JSON.parse(res)
              return new Response({
                status: response.status,
                headers,
                body,
                data: body.data
              })
            }
          }

          try {
            const body = JSON.parse(res)

            if (body.error && body.error.message)
              return Promise.reject(new ResponseError({
                message: body.error.message,
                status: response.status,
                headers,
                body
              }))
            else
              return Promise.reject(new ResponseError({
                message: res,
                status: response.status,
                headers,
                body
              }))
          } catch (error) {
            return Promise.reject(new ResponseError({
              message: res,
              status: response.status,
              headers,
              body: res
            }))
          }
        })
      })
  }
}
