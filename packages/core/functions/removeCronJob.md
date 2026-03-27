[@faasjs/core](../README.md) / removeCronJob

# Function: removeCronJob()

> **removeCronJob**(`cronJob`): `boolean`

Remove a previously registered cron job.

## Parameters

### cronJob

[`CronJob`](../classes/CronJob.md)

Cron job instance to remove.

## Returns

`boolean`

`true` when the job was removed.

## Example

```ts
import { createCronJob, removeCronJob } from '@faasjs/core'

const job = createCronJob({
  expression: '10 * * * *',
  async handler() {},
})

removeCronJob(job)
```
