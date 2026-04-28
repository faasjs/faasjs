import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { loadApiHandler } from '../load_func'

const fixtureRoot = resolve(__dirname, '..')

describe('loadApiHandler', () => {
  it('should load an API file and return its handler', async () => {
    const handler = await loadApiHandler(fixtureRoot, `${fixtureRoot}/basic.api.ts`, 'local')

    const result = await handler('Hello World')

    expect(result).toBe('Hello World')
  })

  it('should reject modules without a default export', async () => {
    await expect(
      loadApiHandler(fixtureRoot, `${fixtureRoot}/named-export.api.ts`, 'local'),
    ).rejects.toThrow('must export a FaasJS API instance as default')
  })

  it('should merge yaml config with inline func config', async () => {
    const handler = await loadApiHandler(fixtureRoot, `${fixtureRoot}/merge.api.ts`, 'local')

    const result = await handler()

    expect(result).toMatchObject({
      plugins: {
        func: {
          config: {
            env: 'defaults',
            source: 'code',
          },
          local: 'local',
          name: 'func',
          type: 'inline-func',
        },
        test: {
          name: 'test',
          type: 'local',
        },
        extra: {
          name: 'extra',
          type: 'inline-extra',
        },
        http: {
          name: 'http',
          type: 'http',
        },
      },
    })
  })
})
