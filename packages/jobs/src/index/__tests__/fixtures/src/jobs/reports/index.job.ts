import { defineJob } from '@faasjs/jobs'
import { getClient } from '@faasjs/pg'

export default defineJob({
  async handler({ job, attempt }) {
    const client = await getClient()

    await client.raw(
      'INSERT INTO job_events (job_id, message, attempt) VALUES (?::uuid, ?, ?)',
      job.id,
      'index',
      attempt,
    )
  },
})
