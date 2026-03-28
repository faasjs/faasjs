[@faasjs/core](../README.md) / closeAll

# Function: closeAll()

> **closeAll**(): `Promise`\<`void`\>

Close every tracked server instance.

## Returns

`Promise`\<`void`\>

Promise that resolves after all servers close.

## Example

```ts
import { Server, closeAll } from '@faasjs/core'

const server = new Server(process.cwd())
server.listen()

await closeAll()
```
