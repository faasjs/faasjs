import type {
  HttpSetBody,
  HttpSetContentType,
  HttpSetHeader,
  HttpSetStatusCode,
} from '@faasjs/core'
import { defineApi } from '@faasjs/core'
import { assertType, expect, it } from 'vitest'
import * as z from 'zod'

type CurrentUser = {
  id: number
  name: string
}

declare module '@faasjs/core' {
  interface DefineApiInject {
    current_user?: CurrentUser | null
  }
}

it('defineApi should infer injected fields from DefineApiInject', () => {
  const func = defineApi({
    schema: z.object({
      name: z.string(),
    }),
    async handler({ current_user, params }) {
      assertType<CurrentUser | null | undefined>(current_user)
      assertType<string>(params.name)

      return current_user?.name ?? params.name
    },
  })

  expect(func).toBeDefined()
})

it('defineApi should expose http injections through DefineApiInject', () => {
  const func = defineApi({
    async handler({ body, headers, setBody, setContentType, setHeader, setStatusCode }) {
      assertType<any>(body)
      assertType<Record<string, any>>(headers)
      assertType<HttpSetBody>(setBody)
      assertType<HttpSetContentType>(setContentType)
      assertType<HttpSetHeader>(setHeader)
      assertType<HttpSetStatusCode>(setStatusCode)

      return true
    },
  })

  expect(func).toBeDefined()
})
