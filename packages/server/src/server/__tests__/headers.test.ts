import { describe, expect, it } from 'vitest'
import { buildCORSHeaders } from '../headers'

describe('buildCORSHeaders', () => {
  it('should return default CORS headers when no headers are provided', () => {
    const result = buildCORSHeaders({
      'x-header': 'test',
    })
    expect(result).toEqual({
      'access-control-allow-origin': '*',
      'access-control-allow-credentials': 'true',
      'access-control-allow-methods': 'OPTIONS, POST',
      'access-control-allow-headers':
        'content-type, authorization, x-faasjs-request-id, x-faasjs-timing-pending, x-faasjs-timing-processing, x-faasjs-timing-total, x-header',
      'access-control-expose-headers':
        'content-type, authorization, x-faasjs-request-id, x-faasjs-timing-pending, x-faasjs-timing-processing, x-faasjs-timing-total, x-header',
    })
  })

  it('should include origin header if provided', () => {
    const result = buildCORSHeaders({ origin: 'https://example.com' })
    expect(result['access-control-allow-origin']).toEqual('https://example.com')
  })

  it('should include additional headers from access-control-request-headers', () => {
    const result = buildCORSHeaders({
      'access-control-request-headers': 'custom-header',
    })
    expect(result['access-control-allow-headers']).toContain('custom-header')
  })

  it('should filter out disallowed headers', () => {
    const result = buildCORSHeaders({
      host: 'localhost',
      connection: 'keep-alive',
      'access-control-request-headers': 'custom-header',
    })
    expect(result['access-control-allow-headers']).not.toContain('host')
    expect(result['access-control-allow-headers']).not.toContain('connection')
    expect(result['access-control-allow-headers']).toContain('custom-header')
  })

  it('should include additional headers passed in the extra parameter', () => {
    const result = buildCORSHeaders({}, { 'Custom-Header': 'CustomValue' })
    expect(result['Custom-Header']).toEqual('CustomValue')
  })
})
