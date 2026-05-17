import { defineApi } from '@faasjs/core'
import { z } from '@faasjs/utils'

export default defineApi({
  schema: z.object({}).strict(),
  async handler({ event }) {
    return {
      route: 'blog/api/post/default',
      path: event.path,
    }
  },
})
