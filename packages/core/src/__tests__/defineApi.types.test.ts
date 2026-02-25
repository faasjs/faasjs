import { defineApi, z } from '@faasjs/core'
import { assertType, test } from 'vitest'

type CurrentUser = {
  id: number
  name: string
}

declare module '@faasjs/core' {
  interface DefineApiInject {
    current_user?: CurrentUser | null
  }
}

test('defineApi should infer injected fields from DefineApiInject', () => {
  defineApi({
    schema: z.object({
      name: z.string(),
    }),
    async handler({ current_user, params }) {
      assertType<CurrentUser | null | undefined>(current_user)
      assertType<string>(params.name)

      return current_user?.name ?? params.name
    },
  })
})
