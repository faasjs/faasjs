import { Response, setMock } from '@faasjs/browser'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { faas } from '../faas'

describe('faas', () => {
  let current = 0

  beforeEach(() => {
    current = 0

    setMock(() => {
      current++
      return Promise.resolve(new Response({ data: current }))
    })
  })

  afterEach(() => {
    setMock(null)
  })

  it('should work', async () => {
    expect(await faas('test', {})).toMatchObject({ data: 1 })
  })

  it('should work with server action', async () => {
    setMock(null)
    expect(
      await faas(async params => ({ data: JSON.parse(params) + 1 }), 1)
    ).toMatchObject({
      data: 2,
    })
  })
})
