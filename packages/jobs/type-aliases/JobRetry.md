[**@faasjs/jobs**](../README.md)

[@faasjs/jobs](../README.md) / JobRetry

# Type Alias: JobRetry

> **JobRetry** = `number` \| [`JobRetryOptions`](JobRetryOptions.md) \| ((`context`) => `Date` \| `number` \| `Promise`\<`Date` \| `number`>>>>>>\>)

Retry strategy — a fixed delay in milliseconds, exponential backoff options,
or a custom function that receives the failure context and returns a delay
or a specific retry date.
