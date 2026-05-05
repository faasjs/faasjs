import { defineApi, Func } from '@faasjs/core'
import { assertType, expect, test } from 'vitest'
import * as z from 'zod'

import { type Cookie, type FuncEventType, type FuncReturnType, type Session } from '../../index'

test('FuncEventType and FuncReturnType should infer from Func', () => {
  const func = new Func<{ counter: number }, any, number>({
    async handler({ event }) {
      event.counter++
      return event.counter
    },
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
  const func = defineApi({
    async handler({ cookie, session }) {
      assertType<Cookie>(cookie)
      assertType<Session>(session)

      return true
    },
  })

  expect(func).toBeDefined()
})
