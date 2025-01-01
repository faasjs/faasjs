[@faasjs/logger](../README.md) / flushTransportMessages

# Function: flushTransportMessages()

> **flushTransportMessages**(): `Promise`\<`void`\>

Flushes the cached log messages by sending them to all registered transports.

If a flush operation is already in progress, this function will wait until
the current flush is complete before starting a new one.

## Returns

`Promise`\<`void`\>

A promise that resolves when the flush operation is complete.

## Example

```typescript
import { flushTransportMessages } from '@faasjs/logger'

process.on('SIGINT', async () => {
  await flushTransportMessages()
  process.exit(0)
})
```
