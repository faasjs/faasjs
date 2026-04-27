import type { Client } from '@faasjs/pg'
import { describe, expect, it } from 'vitest'
import * as z from 'zod'

import { defineJob } from '../define_job'
import type { JobRecord } from '../types'

function jobEvent(params: unknown): any {
  return {
    params,
    client: {} as Client,
    job: {} as JobRecord,
    attempt: 1,
  }
}

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

    await expect(job.export().handler(jobEvent({ count: '2' }))).resolves.toEqual(2)
    await expect(job.export().handler(jobEvent({ count: 'bad' }))).rejects.toThrow(
      'Invalid job params',
    )
  })

  it('uses empty params without schema', async () => {
    const job = defineJob({
      async handler({ params }) {
        return params
      },
    })

    await expect(job.export().handler(jobEvent({ ignored: true }))).resolves.toEqual({})
  })
})
