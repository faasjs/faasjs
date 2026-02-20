import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  loadConfig: vi.fn(),
}))

vi.mock('@faasjs/node-utils', () => ({
  loadConfig: mocks.loadConfig,
}))

import { resolveFaasStaging, resolveServerConfig } from '../server_config'

const originalFaasEnv = process.env.FaasEnv

beforeEach(() => {
  vi.clearAllMocks()

  if (typeof originalFaasEnv === 'string') process.env.FaasEnv = originalFaasEnv
  else delete process.env.FaasEnv
})

afterEach(() => {
  if (typeof originalFaasEnv === 'string') process.env.FaasEnv = originalFaasEnv
  else delete process.env.FaasEnv
})

describe('server_config', () => {
  it('should resolve staging from environment variable', () => {
    process.env.FaasEnv = 'production'

    expect(resolveFaasStaging()).toBe('production')
  })

  it('should use default staging when environment variable is missing', () => {
    delete process.env.FaasEnv

    expect(resolveFaasStaging()).toBe('development')
  })

  it('should resolve root and base from server config', () => {
    mocks.loadConfig.mockReturnValue({
      server: {
        root: 'apps/api',
        base: '/api',
      },
    })

    const result = resolveServerConfig('/tmp/demo', undefined, '/fallback')

    expect(result).toEqual({
      root: '/tmp/demo/apps/api',
      base: '/api',
      staging: 'development',
    })
    expect(mocks.loadConfig).toHaveBeenCalledWith(
      '/tmp/demo/src',
      '/tmp/demo/src/index.func.ts',
      'development',
      undefined,
    )
  })

  it('should fallback to defaults when config is not an object', () => {
    mocks.loadConfig.mockReturnValue(undefined)

    const result = resolveServerConfig('/tmp/demo', undefined, '/fallback')

    expect(result).toEqual({
      root: '/tmp/demo',
      base: '/fallback',
      staging: 'development',
    })
  })
})
