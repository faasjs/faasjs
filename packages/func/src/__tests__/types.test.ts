import { expectType } from 'tsd'
import { type Func, type FuncEventType, type FuncReturnType, useFunc } from '..'

describe('types', () => {
  it('should work', () => {
    const func = useFunc<{ counter: number }>(() => async ({ event }) => {
      event.counter++
      return event.counter
    })

    expectType<Func<{ counter: number }, any, number>>(func)

    expectType<{ counter: number }>({} as FuncEventType<typeof func>)

    expectType<number>({} as FuncReturnType<typeof func>)
  })
})
