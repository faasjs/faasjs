import { defineApi, z } from '@faasjs/core'
import { assertType, test } from 'vitest'
import { type Cookie, type Func, type FuncEventType, type FuncReturnType, type Session, useFunc } from '..'

test('FuncEventType and FuncReturnType should infer from useFunc', () => {
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

test('FuncEventType should include schema params for defineApi', () => {
  const func = defineApi({
    schema: z.object({
      name: z.string(),
    }),
    async handler({ params }) {
      return params.name
    },
  })

  assertType<FuncEventType<typeof func>>({
    params: {
      name: 'FaasJS',
    },
  })

  // @ts-expect-error name should be string
  assertType<FuncEventType<typeof func>>({ params: { name: 1 } })
})

test('FuncEventType should keep wide params when schema is missing', () => {
  const func = defineApi({
    async handler() {
      return true
    },
  })

  assertType<FuncEventType<typeof func>>({})
  assertType<FuncEventType<typeof func>>({ params: { anything: 1 } })
})

test('defineApi handler data should include cookie and session', () => {
  defineApi({
    async handler({ cookie, session }) {
      assertType<Cookie>(cookie)
      assertType<Session>(session)

      return true
    },
  })
})
