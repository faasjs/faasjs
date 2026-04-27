import { defineJob } from '../../../../../index'

export default defineJob({
  async handler({ client, job, attempt }) {
    await client.raw(
      'INSERT INTO job_events (job_id, message, attempt) VALUES (?::uuid, ?, ?)',
      job.id,
      'index',
      attempt,
    )
  },
})
