import { describe, expect, it } from 'vitest'

import { loadFunc } from '../load_func'

describe('loadFunc', () => {
  it('should load a function and return handler', async () => {
    const handler = await loadFunc(__dirname, `${__dirname}/basic.func.ts`, 'local')

    const result = await handler('Hello World')

    expect(result).toBe('Hello World')
  })

  it('should merge yaml config with inline func config', async () => {
    const handler = await loadFunc(__dirname, `${__dirname}/merge.func.ts`, 'local')

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
          type: 'inline-extra',
        },
        http: {
          type: 'http',
        },
      },
    })
  })
})
