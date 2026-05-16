[@faasjs/jobs](../README.md) / JobRegistry

# Type Alias: JobRegistry

> **JobRegistry** = `Map`\<`string`, [`Job`](../classes/Job.md)\<`any`, `any`, `any`\>\>

# @faasjs/jobs

PostgreSQL-backed background jobs for FaasJS.

## Install

```sh
npm install @faasjs/jobs @faasjs/pg
```

## Usage

```ts
import { defineJob, enqueueJob } from '@faasjs/jobs'
import { z } from '@faasjs/utils'

export default defineJob({
  schema: z.object({
    userId: z.string(),
  }),
  async handler({ params }) {
    console.log(params.userId)
  },
})

await enqueueJob('jobs/users/sync', { userId: 'u_123' })
```
