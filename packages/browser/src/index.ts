import type { FaasAction, FaasData, FaasParams } from '@faasjs/types'

import { generateId } from './generateId'

export { generateId } from './generateId'

export type Options = RequestInit & {
  headers?: {
    [key: string]: string
  }
  /** trigger before request */
  beforeRequest?: ({
    action,
    params,
    options,
  }: {
    action: string
    params: Record<string, any>
    options: Options
  }) => Promise<void>
  /** custom request */
  request?: <PathOrData extends FaasAction>(
    url: string,
    options: Options
  ) => Promise<Response<FaasData<PathOrData>>>
}

export type ResponseHeaders = {
  [key: string]: string
}

export type FaasBrowserClientAction = <PathOrData extends FaasAction>(
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

  constructor(props: {
    status?: number
    headers?: ResponseHeaders
    body?: any
    data?: T
  }) {
    this.status = props.status || 200
    this.headers = props.headers || {}
    this.body = props.body
    this.data = props.data

    if (props.data && !props.body) this.body = JSON.stringify(props.data)
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

  constructor({
    message,
    status,
    headers,
    body,
  }: {
    message: string
    status: number
    headers: ResponseHeaders
    body: any
  }) {
    super(message)

    this.status = status
    this.headers = headers
    this.body = body
  }
}

export type MockHandler = (
  action: string,
  params: Record<string, any>,
  options: Options
) => Promise<Response<any>>

let mock: MockHandler

/**
 * Set mock handler for testing
 *
 * @param handler mock handler, set `undefined` to clear mock
 *
 * @example
 * ```ts
 * import { setMock } from '@faasjs/browser'
 *
 * setMock(async ({ action, params, options }) => {
 *   return new Response({
 *     status: 200,
 *     data: {
 *       name: 'FaasJS'
 *     }
 *   })
 * })
 *
 * const client = new FaasBrowserClient('/')
 *
 * const response = await client.action('path') // response.data.name === 'FaasJS'
 * ```
 */
export function setMock(handler: MockHandler) {
  mock = handler
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

  constructor(baseUrl: string, options?: Options) {
    if (!baseUrl) throw Error('[FaasJS] baseUrl required')

    this.id = `FBC-${generateId()}`
    this.host = baseUrl[baseUrl.length - 1] === '/' ? baseUrl : `${baseUrl}/`
    this.defaultOptions = options || Object.create(null)

    console.debug(`[FaasJS] Initialize with baseUrl: ${this.host}`)
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
  public async action<PathOrData extends FaasAction>(
    action: PathOrData | string,
    params?: FaasParams<PathOrData>,
    options?: Options
  ): Promise<Response<FaasData<PathOrData>>> {
    if (!action) throw Error('[FaasJS] action required')

    const id = `F-${generateId()}`

    const url = `${this.host + (action as string).toLowerCase()}?_=${id}`

    if (!params) params = Object.create(null)
    if (!options) options = Object.create(null)

    options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(params),
      ...this.defaultOptions,
      ...options,
    }

    if (!options.headers['X-FaasJS-Request-Id'])
      options.headers['X-FaasJS-Request-Id'] = id

    if (options.beforeRequest)
      await options.beforeRequest({
        action: action as string,
        params,
        options,
      })

    if (options.request) return options.request(url, options)

    if (mock) return mock(action as string, params, options)

    return fetch(url, options).then(async response => {
      const headers: {
        [key: string]: string
      } = {}
      for (const values of response.headers) headers[values[0]] = values[1]

      return response.text().then(res => {
        if (response.status >= 200 && response.status < 300) {
          if (!res)
            return new Response({
              status: response.status,
              headers,
            })

          const body = JSON.parse(res)
          return new Response({
            status: response.status,
            headers,
            body,
            data: body.data,
          })
        }

        try {
          const body = JSON.parse(res)

          if (body.error?.message)
            return Promise.reject(
              new ResponseError({
                message: body.error.message,
                status: response.status,
                headers,
                body,
              })
            )

          return Promise.reject(
            new ResponseError({
              message: res,
              status: response.status,
              headers,
              body,
            })
          )
        } catch (error) {
          return Promise.reject(
            new ResponseError({
              message: res,
              status: response.status,
              headers,
              body: res,
            })
          )
        }
      })
    })
  }
}
