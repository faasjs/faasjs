import * as http from 'http'
import * as https from 'https'
import { URL } from 'url'
import { readFileSync } from 'fs'
import { basename } from 'path'
import { Logger } from '@faasjs/logger'

export type Request = {
  headers?: http.OutgoingHttpHeaders
  method?: string
  host?: string
  path?: string
  query?: http.OutgoingHttpHeaders
  body?: {
    [key: string]: any
  }
}

export type Response<T = any> = {
  request?: Request
  statusCode?: number
  statusMessage?: string
  headers: http.OutgoingHttpHeaders
  body: T
}

export type RequestOptions = {
  /** 请求头 */
  headers?: http.OutgoingHttpHeaders
  /** 请求方法，默认为 GET */
  method?: string
  /** 请求参数，放置于 path 后，若需放置在 body 中，请使用 body 参数 */
  query?: {
    [key: string]: any
  }
  /** 请求体 */
  body?: {
    [key: string]: any
  } | string
  /** 最长耗时，单位为毫秒 */
  timeout?: number
  /** HTTP 认证头，格式为 user:password */
  auth?: string
  /** 上传文件的完整路径 */
  file?: string
  /** 下载流，用于直接将响应内容保存到本地文件，通过 fs.createWriteStream 创建 */
  downloadStream?: NodeJS.WritableStream
  pfx?: Buffer
  passphrase?: string
  agent?: boolean
  /** body 解析器，默认为 JSON.parse */
  parse?: (body: string) => any
}

type Mock = (url: string, options: RequestOptions) => Promise<Response>

let mock: Mock | null = null

/**
 * 设置模拟请求
 * @param handler {function | null} 模拟函数，若设置为 null 则表示清除模拟函数
 * @example setMock(async (url, options) => Promise.resolve({ headers: {}, statusCode: 200, body: { data: 'ok' } }))
 */
export function setMock (handler: Mock | null): void {
  mock = handler
}

export function querystringify (obj: any) {
  const pairs:string[] = []
  let value
  let key

  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      value = obj[key]

      if (!value && (value === null || value === undefined || isNaN(value))) {
        value = ''
      }

      key = encodeURIComponent(key)
      value = encodeURIComponent(value)

      if (key === null || value === null) continue
      pairs.push(key + '=' + value)
    }
  }

  return pairs.length ? pairs.join('&') : ''
}

/**
 * 发起网络请求
 * @param {string} url 请求路径或完整网址
 * @param {object=} [options={}] 参数和配置
 * @param {string} [options.methd=GET] 请求方法
 * @param {object} [options.query={}] 请求参数，放置于 path 后，若需放置在 body 中，请使用 body 参数
 * @param {object} [options.headers={}] 请求头
 * @param {object=} options.body 请求体
 * @param {number=} options.timeout 最长耗时，单位为毫秒
 * @param {string=} options.auth HTTP 认证头，格式为 user:password
 * @param {string=} options.file 上传文件的完整路径
 * @param {WritableStream=} options.downloadStream 下载流，用于直接将响应内容保存到本地文件
 * @param {Buffer=} options.pfx pfx
 * @param {string=} options.passphrase passphrase
 * @param {boolean=} options.agent agent
 * @param {parse=} options.parse body 解析器，默认为 JSON.parse
 *
 * @returns {promise}
 * @url https://faasjs.com/doc/request.html
 */
export async function request<T = any> (url: string, {
  headers,
  method,
  query,
  body,
  timeout,
  auth,
  file,
  downloadStream,
  pfx,
  passphrase,
  agent,
  parse
}: RequestOptions = {
  headers: {},
  query: {}
}): Promise<Response<T>> {
  const log = new Logger('request')

  if (mock)
    return mock(url, {
      headers,
      method,
      query,
      body
    })

  // 序列化 query
  if (query) {
    if (!url.includes('?'))
      url += '?'
    else if (!url.endsWith('?'))
      url += '&'

    url += querystringify(query)
  }

  // 处理 URL 并生成 options
  const uri = new URL(url)
  const protocol = uri.protocol === 'https:' ? https : http

  if (!uri.protocol) throw Error('Unkonw protocol')

  const options: {
    method: string
    headers: http.OutgoingHttpHeaders
    query: http.OutgoingHttpHeaders
    host?: string
    path: string
    port: string
    timeout?: number
    auth?: string
    pfx?: Buffer
    passphrase?: string
    agent?: boolean
  } = {
    headers: {},
    host: uri.host ? uri.host.replace(/:[0-9]+$/, '') : uri.host,
    method: method ? method.toUpperCase() : 'GET',
    path: uri.pathname + uri.search,
    query: {},
    port: uri.port,
    timeout,
    auth,
    pfx,
    passphrase,
    agent
  }

  // 处理 headers
  for (const key in headers)
    if (typeof headers[key] !== 'undefined' && headers[key] !== null)
      options.headers[key] = headers[key]

  // 序列化 body
  if (body && typeof body !== 'string')
    if (
      options.headers['Content-Type'] &&
      options.headers['Content-Type'].toString().includes('application/x-www-form-urlencoded')
    )
      body = querystringify(body)
    else
      body = JSON.stringify(body)

  if (body && !options.headers['Content-Length'])
    options.headers['Content-Length'] = Buffer.byteLength(body as string)

  return await new Promise(function (resolve, reject) {
    log.debug('request %O', {
      ...options,
      body
    })

    const req = protocol.request(options, function (res: http.IncomingMessage) {
      if (downloadStream) {
        res.pipe(downloadStream)
        downloadStream.on('finish', function () {
          resolve(undefined)
        })
      } else {
        const raw: Buffer[] = []
        res.on('data', (chunk: any) => {
          raw.push(chunk)
        })
        res.on('end', () => {
          const data = Buffer.concat(raw).toString()
          log.timeEnd(url, 'response %s %s %s', res.statusCode, res.headers['content-type'], data)

          const response = Object.create(null)
          response.request = options
          response.request.body = body
          response.statusCode = res.statusCode
          response.statusMessage = res.statusMessage
          response.headers = res.headers
          response.body = data

          if (response.body && response.headers['content-type'] && response.headers['content-type'].includes('application/json'))
            try {
              response.body = (parse) ? parse(response.body) : JSON.parse(response.body)
              log.debug('response.parse JSON')
            } catch (error) {
              console.error(error)
            }


          if (response.statusCode >= 200 && response.statusCode < 400) resolve(response); else {
            log.debug('response.error %O', response)
            reject(response)
          }
        })
      }
    })

    if (body) req.write(body)

    if (file) {
      const crlf = '\r\n'
      const boundary = `--${Math.random().toString(16)}`
      const delimeter = `${crlf}--${boundary}`
      const headers = [`Content-Disposition: form-data; name="file"; filename="${basename(file)}"${crlf}`]

      const multipartBody = Buffer.concat([
        Buffer.from(delimeter + crlf + headers.join('') + crlf),
        readFileSync(file),
        Buffer.from(`${delimeter}--`)
      ])

      req.setHeader('Content-Type', 'multipart/form-data; boundary=' + boundary)
      req.setHeader('Content-Length', multipartBody.length)

      req.write(multipartBody)
    }

    req.on('error', function (e: Error) {
      log.timeEnd(url, 'response.error %O', e)
      reject(e)
    })

    log.time(url)
    req.end()
  })
}

export default request
