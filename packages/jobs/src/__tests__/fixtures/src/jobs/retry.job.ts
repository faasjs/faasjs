import * as z from 'zod'

import { defineJob } from '../../../../index'

export default defineJob({
  schema: z.object({
    message: z.string(),
  }),
  retry: 0,
  async handler({ payload, attempt }) {
    throw Error(`${payload.message} ${attempt}`)
  },
})
