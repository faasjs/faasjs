import { Response, setMock } from '..'
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
    expect(await faas('t', {})).toMatchObject({ data: 1 })
  })
})
