import type { IncomingHttpHeaders } from 'node:http'

const AdditionalHeaders = [
  'content-type',
  'authorization',
  'x-faasjs-request-id',
  'x-faasjs-timing-pending',
  'x-faasjs-timing-processing',
  'x-faasjs-timing-total',
]

// Headers that should not be exposed in CORS (standard browser request headers)
const ExposedHeadersBlacklist = [
  'host',
  'connection',
  'user-agent',
  'accept',
  'accept-language',
  'referer',
  'origin',
  'content-length',
  'content-md5',
]

function normalizeHeaderNames(...values: Array<string | string[] | undefined>): string[] {
  return values.flatMap((value) => {
    if (!value) return []

    return (Array.isArray(value) ? value : value.split(','))
      .map((item) => item.trim())
      .filter(Boolean)
  })
}

export function buildCORSHeaders(
  headers: IncomingHttpHeaders,
  extra: IncomingHttpHeaders = {},
): IncomingHttpHeaders {
  const commonHeaderNames = normalizeHeaderNames(
    ...AdditionalHeaders,
    ...Object.keys(headers),
    ...Object.keys(extra),
    extra['access-control-request-headers'],
    headers['access-control-request-headers'],
  ).filter(
    (key) =>
      !!key &&
      !key.startsWith('access-control-') &&
      !ExposedHeadersBlacklist.includes(key.toLowerCase()),
  )

  return {
    'access-control-allow-origin': headers.origin || '*',
    'access-control-allow-credentials': 'true',
    'access-control-allow-methods': 'OPTIONS, POST',
    'access-control-allow-headers': Array.from(
      new Set(
        commonHeaderNames.concat(
          normalizeHeaderNames(
            extra['access-control-allow-headers'],
            headers['access-control-allow-headers'],
          ),
        ),
      ),
    )
      .sort((a, b) => a.localeCompare(b))
      .join(', '),
    'access-control-expose-headers': Array.from(
      new Set(
        commonHeaderNames.concat(
          normalizeHeaderNames(
            extra['access-control-expose-headers'],
            headers['access-control-expose-headers'],
          ),
        ),
      ),
    )
      .sort((a, b) => a.localeCompare(b))
      .join(', '),
    ...extra,
  }
}
