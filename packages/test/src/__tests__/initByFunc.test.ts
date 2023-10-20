import { Func, FuncWarper } from '../../src/index'

describe('init by func', function () {
  test('200', async function () {
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
