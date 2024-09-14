/**
 * @jest-environment jsdom
 */
import { faas } from '../faas'
import { Response, setMock } from '@faasjs/browser'

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
    setMock(undefined)
  })

  it('should work', async () => {
    expect(await faas('test', {})).toMatchObject({ data: 1 })
  })
})
