import { describe, expect, it } from 'vitest'
import { Func, FuncWarper } from '../../src/index'

describe('init by func', () => {
  it('200', async () => {
    const func = new Func({
      async handler() {
        return true
      },
    })
    const warper = new FuncWarper(func)
    const res = await warper.handler({}, {})

    expect(res).toEqual(true)
  })
})
