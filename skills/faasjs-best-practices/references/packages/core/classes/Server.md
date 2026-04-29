[@faasjs/core](../README.md) / Server

# Class: Server

HTTP server that loads and runs FaasJS API files from an app source root.

A Server resolves API route files on demand, caches loaded handlers, and
dispatches each request through the matching function lifecycle.

## Example

```ts
import { join } from 'node:path'
import { Server } from '@faasjs/core'

const server = new Server(join(process.cwd(), 'src'), {
  port: 8080,
})

server.listen()
```

## Constructors

### Constructor

> **new Server**(`root`, `opts?`): `Server`

Create a server rooted at a FaasJS app source directory.

#### Parameters

##### root

`string`

App source root used to resolve configuration and route files.

##### opts?

[`ServerOptions`](../type-aliases/ServerOptions.md) = `{}`

Server configuration overrides.

#### Returns

`Server`

#### Throws

When `onStart`, `onError`, or `onClose` is not an async function.

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Close the server and wait for active requests to finish.

#### Returns

`Promise`\<`void`\>

Promise that resolves after sockets, requests, and transports stop.

### handle()

> **handle**(`req`, `res`, `options?`): `Promise`\<`void`\>

Handle a single incoming HTTP request.

#### Parameters

##### req

`IncomingMessage`

Incoming Node.js request.

##### res

`ServerResponse`\<`IncomingMessage`\>

Node.js response writer.

##### options?

[`ServerHandlerOptions`](../type-aliases/ServerHandlerOptions.md) = `{}`

Optional request metadata and forced filepath override.

#### Returns

`Promise`\<`void`\>

Promise that resolves after the request has been handled.

### listen()

> **listen**(): `Server`

Start the underlying Node.js HTTP server.

#### Returns

`Server`

Underlying Node.js server instance.

#### Throws

When the server is already running.

### middleware()

> **middleware**(`req`, `res`, `next`): `Promise`\<`void`\>

Express-style middleware wrapper that delegates to [Server.handle](#handle).

#### Parameters

##### req

`IncomingMessage`

Incoming HTTP request object.

##### res

`ServerResponse`\<`IncomingMessage`\>

Server response object.

##### next

() => `void`

Callback used to continue the middleware chain when FaasJS does not handle the request.

#### Returns

`Promise`\<`void`\>

Promise that resolves when middleware processing finishes.

## Properties

### closed

> `protected` **closed**: `boolean` = `false`

### logger

> `readonly` **logger**: `Logger`

Shared server logger.

### options

> `readonly` **options**: [`ServerOptions`](../type-aliases/ServerOptions.md)

Effective server options with defaults applied.

### root

> `readonly` **root**: `string`

Normalized app source root used to resolve route files.
