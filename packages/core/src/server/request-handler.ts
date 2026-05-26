import type { IncomingMessage, ServerResponse } from 'node:http'

import type { Logger } from '@faasjs/node-utils'

import type { Middleware } from '../middleware'
import { buildCORSHeaders } from './headers'
import { respondWithInternalServerError } from './response'

/**
 * Read the incoming request body as a string.
 *
 * Listens for `readable` and `end` events to accumulate the body content.
 *
 * @param {IncomingMessage} req - Incoming Node.js request.
 * @returns {Promise<string>} Promise that resolves with the full request body string.
 */
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

/**
 * Execute the server-level `beforeHandle` middleware when one is configured.
 *
 * When the middleware writes to the response, subsequent request handling is skipped.
 *
 * @param {Middleware | undefined} beforeHandle - Optional middleware configured via {@link ServerOptions.beforeHandle}.
 * @param {IncomingMessage} req - Incoming Node.js request.
 * @param {ServerResponse} res - Node.js response writer.
 * @param {string} root - Normalized app source root.
 * @param {Logger} logger - Request-scoped logger instance.
 * @returns {Promise<boolean>} `true` when the middleware did not finalize the response, `false` when it did.
 */
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

/**
 * Construct the normalized event and context payloads for a FaasJS function invocation.
 *
 * Parses the request URL into separate `path` and `queryString` components and
 * assembles the standard FaasJS event shape consumed by plugin pipelines.
 *
 * @param {(...args: any) => Promise<any>} handler - Loaded FaasJS function handler.
 * @param {IncomingMessage} req - Incoming Node.js request.
 * @param {ServerResponse} res - Node.js response writer.
 * @param {string} requestUrl - Raw request URL extracted from the incoming request.
 * @param {string} body - Request body string collected by the server.
 * @param {string} requestId - Unique request identifier forwarded as the context request_id.
 * @param {string} root - Normalized app source root forwarded as the context root.
 * @returns {Promise<any>} Promise that resolves with the handler return value.
 */
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

/**
 * Respond to an HTTP `OPTIONS` preflight request with CORS headers.
 *
 * Sends a `204 No Content` response containing only default CORS headers,
 * without invoking any FaasJS function handler.
 *
 * @param {IncomingMessage} req - Incoming Node.js request.
 * @param {ServerResponse} res - Node.js response writer.
 * @returns {void} No return value.
 */
export function handleOptionRequest(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
): void {
  res.writeHead(204, buildCORSHeaders(req.headers))
  res.end()
}
