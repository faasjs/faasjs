import { defineJob } from '@faasjs/jobs'
import { z } from '@faasjs/utils'

export default defineJob({
  schema: z.object({
    message: z.string(),
  }),
  retry: 0,
  async handler({ params, attempt }) {
    throw Error(`${params.message} ${attempt}`)
  },
})
