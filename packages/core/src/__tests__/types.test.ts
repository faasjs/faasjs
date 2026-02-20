import { assertType, describe, it } from 'vitest'
import { type Func, type FuncEventType, type FuncReturnType, useFunc } from '..'

describe('types', () => {
  it('should work', () => {
    const func = useFunc<{ counter: number }>(() => async ({ event }) => {
      event.counter++
      return event.counter
    })

    assertType<Func<{ counter: number }, any, number>>(func)

    assertType<{
      counter: number
    }>({} as FuncEventType<typeof func>)

    assertType<number>({} as FuncReturnType<typeof func>)
  })
})
