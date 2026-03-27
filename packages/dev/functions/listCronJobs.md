[@faasjs/dev](../README.md) / listCronJobs

# Function: listCronJobs()

> **listCronJobs**(): [`CronJob`](../classes/CronJob.md)[]

List all registered cron jobs.

## Returns

[`CronJob`](../classes/CronJob.md)[]

## Example

```ts
import { createCronJob, listCronJobs } from '@faasjs/core'

createCronJob({
  name: 'cleanup',
  expression: '0 3 * * *',
  async handler() {},
})

listCronJobs().map((job) => job.name)
```
