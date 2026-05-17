import { defineApi } from '@faasjs/core'
import { z } from '@faasjs/utils'

export default defineApi({
  schema: z.object({}).strict(),
  async handler() {
    return {
      route: 'blog/api/index',
    }
  },
})
