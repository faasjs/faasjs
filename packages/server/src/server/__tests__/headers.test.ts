import { describe, expect, it } from 'vitest'
import { buildCORSHeaders } from '../headers'

describe('buildCORSHeaders', () => {
  it('should return default CORS headers when no headers are provided', () => {
    const result = buildCORSHeaders({
      'x-header': 'test',
    })
    expect(result['access-control-allow-origin']).toEqual('*')
    expect(result['access-control-allow-credentials']).toEqual('true')
    expect(result['access-control-allow-methods']).toEqual('OPTIONS, POST')
    expect(result['access-control-allow-headers']).toContain('content-type')
    expect(result['access-control-allow-headers']).toContain('authorization')
    expect(result['access-control-allow-headers']).toContain(
      'x-faasjs-request-id'
    )
    expect(result['access-control-allow-headers']).toContain(
      'x-faasjs-timing-pending'
    )
    expect(result['access-control-allow-headers']).toContain(
      'x-faasjs-timing-processing'
    )
    expect(result['access-control-allow-headers']).toContain(
      'x-faasjs-timing-total'
    )
    expect(result['access-control-allow-headers']).toContain('x-header')
    expect(result['access-control-expose-headers']).toContain('content-type')
    expect(result['access-control-expose-headers']).toContain('authorization')
    expect(result['access-control-expose-headers']).toContain(
      'x-faasjs-request-id'
    )
    expect(result['access-control-expose-headers']).toContain(
      'x-faasjs-timing-pending'
    )
    expect(result['access-control-expose-headers']).toContain(
      'x-faasjs-timing-processing'
    )
    expect(result['access-control-expose-headers']).toContain(
      'x-faasjs-timing-total'
    )
    expect(result['access-control-expose-headers']).toContain('x-header')
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
