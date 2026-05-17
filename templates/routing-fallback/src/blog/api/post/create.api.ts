import { defineApi } from '@faasjs/core'
import { z } from '@faasjs/utils'

export default defineApi({
  schema: z.object({
    title: z.nonemptystring(),
  }),
  async handler() {
    return {
      route: 'blog/api/post/create',
      created: true,
    }
  },
})
