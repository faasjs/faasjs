[**@faasjs/jobs**](../README.md)

[@faasjs/jobs](../README.md) / JobWorkerOptions

# Type Alias: JobWorkerOptions

> **JobWorkerOptions** = [`LoadJobRegistryOptions`](LoadJobRegistryOptions.md) & `object`

Options for [startJobWorker](../functions/startJobWorker.md).

## Type Declaration

### concurrency?

> `optional` **concurrency?**: `number`

Number of jobs to claim per poll tick. Defaults to `1`.

### leaseSeconds?

> `optional` **leaseSeconds?**: `number`

Lease duration in seconds before a claimed job can be re-claimed. Defaults to `60`.

### pollInterval?

> `optional` **pollInterval?**: `number`

Milliseconds between poll ticks. Defaults to `1000`.

### queue?

> `optional` **queue?**: `string`

Queue name to poll. Defaults to `'default'`.

### workerId?

> `optional` **workerId?**: `string`

Unique identifier for this worker instance. Auto-generated when omitted.
