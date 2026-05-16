import { defineJob } from '@faasjs/jobs'
import { getClient } from '@faasjs/pg'
import { z } from '@faasjs/utils'

export default defineJob({
  schema: z.object({
    message: z.string(),
  }),
  cron: [
    {
      expression: '* * * * *',
      timezone: 'UTC',
      params: {
        message: 'from cron',
      },
    },
  ],
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
