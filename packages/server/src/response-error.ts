import type { ServerResponse } from 'node:http'

export const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal Server Error'

type ErrorWithStatusCode = {
  statusCode?: unknown
  message?: unknown
}

export function getErrorStatusCode(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') return undefined

  const statusCode = (error as ErrorWithStatusCode).statusCode
  if (typeof statusCode !== 'number' || !Number.isFinite(statusCode)) return undefined

  return statusCode
}

export function getErrorMessage(error: unknown, fallback = INTERNAL_SERVER_ERROR_MESSAGE): string {
  if (error && typeof error === 'object') {
    const message = (error as ErrorWithStatusCode).message
    if (typeof message === 'string' && message.length) return message
  }

  return fallback
}

export function respondWithJsonError(
  res: ServerResponse,
  statusCode: number,
  message: string,
): void {
  if (res.writableEnded) return

  if (res.headersSent) {
    res.end()
    return
  }

  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(
    JSON.stringify({
      error: {
        message,
      },
    }),
  )
}

export function respondWithInternalServerError(res: ServerResponse): void {
  if (res.writableEnded) return

  if (res.headersSent) {
    res.end()
    return
  }

  res.statusCode = 500
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end(INTERNAL_SERVER_ERROR_MESSAGE)
}
