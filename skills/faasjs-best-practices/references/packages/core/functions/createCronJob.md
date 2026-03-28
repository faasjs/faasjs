[@faasjs/core](../README.md) / createCronJob

# Function: createCronJob()

> **createCronJob**(`options`): [`CronJob`](../classes/CronJob.md)

Create and register a cron job.

Registered jobs are managed by `Server` lifecycle automatically.

## Parameters

### options

[`CronJobOptions`](../type-aliases/CronJobOptions.md)

Cron job definition.

## Returns

[`CronJob`](../classes/CronJob.md)

Registered cron job instance.

## Throws

When the cron expression is invalid.

## Example

```ts
import { createCronJob } from '@faasjs/core'

const job = createCronJob({
  name: 'cleanup',
  expression: '0 3 * * *',
  async handler() {
    console.log('cleanup')
  },
})
```
