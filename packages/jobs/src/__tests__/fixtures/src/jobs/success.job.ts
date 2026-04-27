import { getClient } from '@faasjs/pg'
import * as z from 'zod'

import { defineJob } from '../../../../index'

export default defineJob({
  schema: z.object({
    message: z.string(),
  }),
  async handler({ params, job, attempt }) {
    const client = await getClient()

    await client.raw(
      'INSERT INTO job_events (job_id, message, attempt) VALUES (?::uuid, ?, ?)',
      job.id,
      params.message,
      attempt,
    )
  },
})
