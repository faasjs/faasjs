import { defineJob } from '../../../../index'

export default defineJob({
  cron: [
    {
      expression: '* * * * *',
      timezone: 'UTC',
      payload: {
        message: 'from cron',
      },
    },
  ],
  async handler({ payload, client, job, attempt }) {
    await client.raw(
      'INSERT INTO job_events (job_id, message, attempt) VALUES (?::uuid, ?, ?)',
      job.id,
      (payload as { message: string }).message,
      attempt,
    )
  },
})
