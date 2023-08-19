import type {
  FaasAction, FaasData, FaasParams
} from '@faasjs/types'

export type Options = RequestInit & {
  headers?: {
    [key: string]: string
  }
  /** trigger before request */
  beforeRequest?: ({
    action, params, options
  }: {
    action: string
    params: Record<string, any>
    options: Options
  }) => Promise<void> | void
  /** custom request */
  request?: <PathOrData extends FaasAction> (url: string, options: Options) => Promise<Response<FaasData<PathOrData>>>
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

export function generateId () {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

/**
 * FaasJS browser client

 * ```ts
 * const client = new FaasBrowserClient('http://localhost:8080')
 *
 * await client.action('func', { key: 'value' })
 * ```
 */
export class FaasBrowserClient {
  public readonly id: string
  public host: string
  public defaultOptions: Options

  constructor (baseUrl: string, options?: Options) {
    if (!baseUrl) throw Error('[FaasJS] baseUrl required')

    this.id = 'FBC-' + generateId()
    this.host = baseUrl[baseUrl.length - 1] === '/' ? baseUrl : baseUrl + '/'
    this.defaultOptions = options || Object.create(null)

    console.debug('[FaasJS] Initialize with baseUrl: ' + this.host)
  }

  /**
   * Request a FaasJS function
   * @param action function path
   * @param params function params
   * @param options request options
   * ```ts
   * await client.action('func', { key: 'value' })
   * ```
   */
  public async action<PathOrData extends FaasAction> (
    action: PathOrData | string,
    params?: FaasParams<PathOrData>,
    options?: Options
  ): Promise<Response<FaasData<PathOrData>>> {
    if (!action) throw Error('[FaasJS] action required')

    const id = 'F-' + generateId()

    const url = this.host + (action as string).toLowerCase() + '?_=' + id

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

    if (!options.headers['X-FaasJS-Request-Id']) options.headers['X-FaasJS-Request-Id'] = id

    if (options.beforeRequest)
      await options.beforeRequest({
        action: action as string,
        params,
        options
      })

    if (options.request)
      return options.request(url, options)

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
                headers,
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
