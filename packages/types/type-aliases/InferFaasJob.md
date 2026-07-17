[@faasjs/types](../README.md) / InferFaasJob

# Type Alias: InferFaasJob\<TJob\>

> **InferFaasJob**\<`TJob`\> = `TJob` *extends* `object` ? `object` : `TJob` *extends* `object` ? `TDefault` *extends* `object` ? `object` : `never` : `never`

Infer `{ Params }` from a FaasJS job definition or a module whose default
export is a FaasJS job definition.

## Type Parameters

### TJob

`TJob`

A `Job` object or module with a default `Job` export.

## Returns

An object containing the job params type, or `never` when inference fails.

## Example

```ts
import type { InferFaasJob } from '@faasjs/types'
import type * as syncJob from './features/users/jobs/sync.job'

type SyncJob = InferFaasJob<typeof syncJob>
// → { Params: { userId: string } }
```

## See

 - [FaasJobParams](FaasJobParams.md)
 - [FaasJobPaths](FaasJobPaths.md)
