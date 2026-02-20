import type { IncomingMessage, ServerResponse } from 'node:http'

export const BAD_REQUEST_URL_MESSAGE = 'Bad Request: url is undefined'

export function ensureRequestUrl(req: IncomingMessage, res: ServerResponse): string | undefined {
  if (req.url) return req.url

  res.statusCode = 400
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end(BAD_REQUEST_URL_MESSAGE)

  return undefined
}
