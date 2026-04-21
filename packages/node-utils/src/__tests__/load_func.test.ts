import { describe, expect, it } from 'vitest'

import { loadApiHandler } from '../load_func'

describe('loadApiHandler', () => {
  it('should load an API file and return its handler', async () => {
    const handler = await loadApiHandler(__dirname, `${__dirname}/basic.api.ts`, 'local')

    const result = await handler('Hello World')

    expect(result).toBe('Hello World')
  })

  it('should keep support for legacy named func exports', async () => {
    const handler = await loadApiHandler(__dirname, `${__dirname}/legacy.api.ts`, 'local')

    const result = await handler()

    expect(result).toBe('legacy')
  })

  it('should prefer default export before legacy func export', async () => {
    const handler = await loadApiHandler(__dirname, `${__dirname}/priority.api.ts`, 'local')

    const result = await handler()

    expect(result).toBe('default')
  })

  it('should merge yaml config with inline func config', async () => {
    const handler = await loadApiHandler(__dirname, `${__dirname}/merge.api.ts`, 'local')

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
