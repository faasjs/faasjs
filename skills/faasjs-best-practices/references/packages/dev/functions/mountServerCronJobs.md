[@faasjs/dev](../README.md) / mountServerCronJobs

# Function: mountServerCronJobs()

> **mountServerCronJobs**(): `void`

Start cron jobs for the current mounted server lifecycle.

## Returns

`void`

## Example

```ts
import { createCronJob, mountServerCronJobs, unmountServerCronJobs } from '@faasjs/core'

createCronJob({
  expression: '5 * * * *',
  async handler() {},
})

mountServerCronJobs()
unmountServerCronJobs()
```
