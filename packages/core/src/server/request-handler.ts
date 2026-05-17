import type { IncomingMessage, ServerResponse } from 'node:http'
import { Readable } from 'node:stream'

import type { Logger } from '@faasjs/node-utils'

import type { Middleware } from '../middleware'
import {
  getErrorMessage,
  INTERNAL_SERVER_ERROR_MESSAGE,
  respondWithInternalServerError,
  respondWithJsonError,
} from '../response-error'
import { buildCORSHeaders } from './headers'

export function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let body = ''

    req.on('readable', () => {
      body += req.read() || ''
    })

    req.on('end', () => {
      resolve(body)
    })
  })
}

export async function runBeforeHandle(
  beforeHandle: Middleware | undefined,
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  root: string,
  logger: Logger,
): Promise<boolean> {
  if (!beforeHandle) return true

  try {
    await beforeHandle(req, res, {
      logger,
      root,
    })

    return !res.writableEnded
  } catch (error: any) {
    logger.error(error)
    respondWithInternalServerError(res)

    return false
  }
}

export function invokeHandler(
  handler: (...args: any) => Promise<any>,
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  requestUrl: string,
  body: string,
  requestId: string,
  root: string,
): Promise<any> {
  const url = new URL(requestUrl, `http://${req.headers.host}`)

  return handler(
    {
      headers: req.headers,
      httpMethod: req.method,
      path: url.pathname,
      queryString: Object.fromEntries(new URLSearchParams(url.search)),
      body,
      raw: {
        request: req,
        response: res,
      },
    },
    {
      request_id: requestId,
      root,
    },
  )
}

export function buildResponseHeaders(
  req: IncomingMessage,
  requestId: string,
  requestedAt: number,
  startedAt: number,
  data: any,
) {
  const finishedAt = Date.now()

  let headers = buildCORSHeaders(req.headers, {
    'x-faasjs-request-id': requestId,
    'x-faasjs-timing-pending': (startedAt - requestedAt).toString(),
  })

  if (data.headers) headers = Object.assign(headers, data.headers)

  if (!headers['x-faasjs-timing-processing'])
    headers['x-faasjs-timing-processing'] = (finishedAt - startedAt).toString()

  if (!headers['x-faasjs-timing-total'])
    headers['x-faasjs-timing-total'] = (finishedAt - requestedAt).toString()

  Object.freeze(headers)

  return headers
}

export function pipeToResponse(
  stream: Readable,
  res: ServerResponse<IncomingMessage>,
  done: () => void,
  onError: (error: any) => void,
): void {
  stream
    .pipe(res)
    .on('finish', () => {
      res.end()
      done()
    })
    .on('error', (err) => {
      onError(err)
      respondWithInternalServerError(res)
      done()
    })
}

export async function respondWithStreamData(
  data: any,
  res: ServerResponse<IncomingMessage>,
  logger: Logger,
  onError: (error: any) => void,
): Promise<boolean> {
  if (data instanceof Response) {
    res.statusCode = data.status

    const reader = data.body?.getReader()

    if (reader) {
      const stream = Readable.from(
        (async function* () {
          while (true) {
            try {
              const { done, value } = await reader.read()
              if (done) break
              if (value) yield value
            } catch (error: any) {
              logger.error(error)
              break
            }
          }
        })(),
      )

      await new Promise<void>((done) => {
        pipeToResponse(stream, res, done, onError)
      })

      return true
    }

    res.end()
    return true
  }

  if (data.body instanceof ReadableStream) {
    if (typeof data.statusCode === 'number') res.statusCode = data.statusCode

    await new Promise<void>((done) => {
      pipeToResponse(Readable.fromWeb(data.body), res, done, onError)
    })

    return true
  }

  return false
}

export function handleOptionRequest(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
): void {
  res.writeHead(204, buildCORSHeaders(req.headers))
  res.end()
}

export function respondWithError(
  data: any,
  res: ServerResponse<IncomingMessage>,
  statusCode: number | undefined,
  logger?: Logger,
): void {
  if (
    data instanceof Error ||
    data?.constructor?.name?.includes('Error') ||
    typeof data === 'undefined' ||
    data === null
  ) {
    if (typeof statusCode === 'number')
      respondWithJsonError(
        res,
        statusCode,
        getErrorMessage(data, statusCode === 500 ? INTERNAL_SERVER_ERROR_MESSAGE : 'No response'),
      )
    else respondWithInternalServerError(res)

    return
  }

  if (typeof statusCode === 'number') res.statusCode = statusCode

  let resBody: string | Buffer | undefined
  if (data.body) resBody = data.body

  if (typeof resBody !== 'undefined') {
    logger?.debug('Response %s %j', res.statusCode, res.getHeaders())
    res.write(resBody)
  }

  res.end()
}
