import { ApiTester, Func } from '@faasjs/dev'
import { describe, expect, it } from 'vitest'

describe('init by func', () => {
  it('200', async () => {
    const func = new Func({
      async handler() {
        return true
      },
    })
    const tester = new ApiTester(func)
    const res = await tester.handler({}, {})

    expect(res).toEqual(true)
  })
})
