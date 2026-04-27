import { getClient } from '@faasjs/pg'

import { defineJob } from '../../../../../index'

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
