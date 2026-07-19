[**@faasjs/jobs**](../README.md)

[@faasjs/jobs](../README.md) / startJobWorker

# Function: startJobWorker()

> **startJobWorker**(`options?`): `Promise`\<[`JobWorker`](../classes/JobWorker.md)>>>>\>

Discover job definitions and start a worker immediately.

This is the recommended shorthand for initializing the schema,
loading the job registry, and starting the polling loop in one call.

## Parameters

### options?

[`JobWorkerOptions`](../type-aliases/JobWorkerOptions.md) = `{}`

Worker options.

## Returns

`Promise`\<[`JobWorker`](../classes/JobWorker.md)\>

A running `JobWorker` instance.

## Example

```ts
const worker = await startJobWorker({ concurrency: 5 })
```
