[@faasjs/jobs](../README.md) / LoadJobRegistryOptions

# Type Alias: LoadJobRegistryOptions

> **LoadJobRegistryOptions** = `object`

PostgreSQL-backed background jobs for FaasJS.

## Install

```sh
npm install @faasjs/jobs @faasjs/pg
```

## Usage

```ts
import { defineJob, enqueueJob } from '@faasjs/jobs'
import * as z from 'zod'

export default defineJob({
  schema: z.object({
    userId: z.string(),
  }),
  async handler({ payload }) {
    console.log(payload.userId)
  },
})

await enqueueJob('jobs/users/sync', { userId: 'u_123' })
```

## Properties

### logger?

> `optional` **logger?**: `Logger`

### root?

> `optional` **root?**: `string`

### staging?

> `optional` **staging?**: `string`
