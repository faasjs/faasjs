import { describe, expect, it } from 'vitest'
import * as z from 'zod'

import { defineJob } from '../define_job'

describe('defineJob', () => {
  it('validates params with schema before calling handler', async () => {
    const job = defineJob({
      schema: z.object({
        count: z.coerce.number(),
      }),
      async handler({ params }) {
        return params.count
      },
    })

    await expect(job.export().handler({ params: { count: '2' } })).resolves.toEqual(2)
    await expect(job.export().handler({ params: { count: 'bad' } })).rejects.toThrow(
      'Invalid job params',
    )
  })

  it('uses default event values', async () => {
    const job = defineJob({
      async handler({ attempt, job, params }) {
        return {
          attempt,
          job,
          params,
        }
      },
    })

    await expect(job.export().handler()).resolves.toMatchObject({
      attempt: 1,
      job: {
        id: '00000000-0000-0000-0000-000000000000',
        attempts: 1,
        queue: 'default',
        status: 'running',
      },
      params: {},
    })
  })
})
