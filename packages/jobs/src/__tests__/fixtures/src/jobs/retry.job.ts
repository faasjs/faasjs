import { defineJob } from '@faasjs/jobs'
import * as z from 'zod'

export default defineJob({
  schema: z.object({
    message: z.string(),
  }),
  retry: 0,
  async handler({ params, attempt }) {
    throw Error(`${params.message} ${attempt}`)
  },
})
