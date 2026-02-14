import { describe, expect, it } from 'vitest'
import { loadFunc } from '../load_func'

describe('loadFunc', () => {
  it('should load a function and return handler', async () => {
    const handler = await loadFunc(
      __dirname,
      `${__dirname}/basic.func.ts`,
      'local'
    )

    const result = await handler('Hello World')

    expect(result).toBe('Hello World')
  })
})
