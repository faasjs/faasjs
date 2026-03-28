[@faasjs/dev](../README.md) / getAll

# Function: getAll()

> **getAll**(): [`Server`](../classes/Server.md)[]

Return all server instances created in the current process.

## Returns

[`Server`](../classes/Server.md)[]

Server instances tracked by the current process.

## Example

```ts
import { Server, getAll } from '@faasjs/core'

const server = new Server(process.cwd())

getAll().includes(server)
```
