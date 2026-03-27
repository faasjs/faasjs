[@faasjs/node-utils](../README.md) / getTransport

# Function: getTransport()

> **getTransport**(): [`Transport`](../classes/Transport.md)

Get the shared transport instance used by Logger.

## Returns

[`Transport`](../classes/Transport.md)

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
