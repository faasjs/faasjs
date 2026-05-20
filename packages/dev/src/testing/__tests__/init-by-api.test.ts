import { ApiTester, Func } from '@faasjs/dev'
import { describe, expect, it } from 'vitest'

describe('init by api', () => {
  it('200', async () => {
    const api = new Func({
      async handler() {
        return true
      },
    })
    const tester = new ApiTester(api)
    const res = await tester.handler({}, {})

    expect(res).toEqual(true)
  })
})
