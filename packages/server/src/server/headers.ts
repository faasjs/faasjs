import type { IncomingHttpHeaders } from 'node:http'

const AdditionalHeaders = [
  'content-type',
  'authorization',
  'x-faasjs-request-id',
  'x-faasjs-timing-pending',
  'x-faasjs-timing-processing',
  'x-faasjs-timing-total',
]

export function buildCORSHeaders(headers: IncomingHttpHeaders, extra: IncomingHttpHeaders = {}): IncomingHttpHeaders {
  const commonHeaderNames = [
    ...AdditionalHeaders,
    ...Object.keys(headers),
    ...Object.keys(extra),
    extra['access-control-request-headers'],
    headers['access-control-request-headers'],
  ].filter(
    key =>
      !!key &&
      !key.startsWith('access-control-') &&
      !['host', 'connection'].includes(key)
  );

  return {
    'access-control-allow-origin': headers.origin || '*',
    'access-control-allow-credentials': 'true',
    'access-control-allow-methods': 'OPTIONS, POST',
    'access-control-allow-headers': Array.from(new Set(commonHeaderNames
      .concat(extra['access-control-allow-headers'] || headers['access-control-allow-headers'] || [])))
      .join(', '),
    'access-control-expose-headers': Array.from(new Set(commonHeaderNames
      .concat(extra['access-control-expose-headers'] || headers['access-control-expose-headers'] || [])))
      .join(', '),
    ...extra,
  }
}
