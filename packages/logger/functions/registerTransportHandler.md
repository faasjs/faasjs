[@faasjs/logger](../README.md) / registerTransportHandler

# Function: registerTransportHandler()

> **registerTransportHandler**(`name`, `handler`): `void`

Registers a transport handler with a given name.

## Parameters

### name

`string`

The name of the transport handler.

### handler

[`TransportHandler`](../type-aliases/TransportHandler.md)

The transport handler to be registered.

## Returns

`void`

## Example

```typescript
import { registerTransportHandler } from '@faasjs/logger'

registerTransportHandler('test', async (messages) => {
 for (const { level, message } of messages)
  console.log(level, message)
})
```
