[@faasjs/jobs](../README.md) / startJobScheduler

# Function: startJobScheduler()

> **startJobScheduler**(`options?`): `Promise`\<[`JobScheduler`](../classes/JobScheduler.md)\>

Discover job definitions and start a scheduler immediately.

This is the recommended shorthand for initializing the schema,
loading the job registry, and starting the cron loop in one call.

## Parameters

### options?

[`JobSchedulerOptions`](../type-aliases/JobSchedulerOptions.md) = `{}`

Scheduler options.

## Returns

`Promise`\<[`JobScheduler`](../classes/JobScheduler.md)\>

A running `JobScheduler` instance.

## Example

```ts
const scheduler = await startJobScheduler({ pollInterval: 60_000 })
```
