[@faasjs/dev](../README.md) / closeAll

# Function: closeAll()

> **closeAll**(): `Promise`\<`void`\>

Close every tracked server instance.

## Returns

`Promise`\<`void`\>

Promise that resolves after all servers close.

## Example

```ts
import { join } from 'node:path'
import { Server, closeAll } from '@faasjs/core'

const server = new Server(join(process.cwd(), 'src'))
server.listen()

await closeAll()
```
