import { describe, expect, it } from 'vitest'

import { ApiTester, Func } from '../../index'

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
