import type { IncomingMessage, ServerResponse } from 'node:http'

import type { Logger } from '@faasjs/node-utils'

import type { Middleware } from '../middleware'
import { buildCORSHeaders } from './headers'
import { respondWithInternalServerError } from './response'

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

export function handleOptionRequest(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
): void {
  res.writeHead(204, buildCORSHeaders(req.headers))
  res.end()
}
