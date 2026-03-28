[@faasjs/node-utils](../README.md) / getTransport

# Function: getTransport()

> **getTransport**(): [`Transport`](../classes/Transport.md)

Return the singleton transport used by [Logger](../classes/Logger.md).

The instance is created lazily on first access.

## Returns

[`Transport`](../classes/Transport.md)

Shared transport instance.

## Example

```ts
import { getTransport, Logger } from '@faasjs/node-utils'

const transport = getTransport()

transport.register('console', async (messages) => {
  console.log(messages.length)
})

new Logger('app').info('hello')
await transport.flush()
```
