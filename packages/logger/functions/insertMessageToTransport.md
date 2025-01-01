[@faasjs/logger](../README.md) / insertMessageToTransport

# Function: insertMessageToTransport()

> **insertMessageToTransport**(`message`): `void`

Inserts a log message into the transport.

## Parameters

### message

[`LoggerMessage`](../type-aliases/LoggerMessage.md)

The log message to insert.

## Returns

`void`

## Example

```typescript
import { insertMessageToTransport } from '@faasjs/logger'

insertMessageToTransport({
  level: 'info',
  labels: ['server'],
  message: 'test message',
  timestamp: Date.now()
})
```
