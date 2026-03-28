[@faasjs/core](../README.md) / unmountServerCronJobs

# Function: unmountServerCronJobs()

> **unmountServerCronJobs**(): `void`

Stop cron jobs when the last mounted server is unmounted.

## Returns

`void`

## Example

```ts
import { mountServerCronJobs, unmountServerCronJobs } from '@faasjs/core'

mountServerCronJobs()
unmountServerCronJobs()
```
