import * as z from 'zod'

import { defineJob } from '../../../../index'

export default defineJob({
  schema: z.object({
    message: z.string(),
  }),
  retry: 0,
  async handler({ params, attempt }) {
    throw Error(`${params.message} ${attempt}`)
  },
})
