[@faasjs/dev](../README.md) / Server

# Class: Server

FaasJS Server.

## Example

```ts
import { Server } from '@faasjs/core'

const server = new Server(process.cwd(), {
  port: 8080,
})

server.listen()
```

## Constructors

### Constructor

> **new Server**(`root`, `opts?`): `Server`

Create a server rooted at a FaasJS project directory.

#### Parameters

##### root

`string`

Root directory used to resolve configuration and route files.

##### opts?

[`ServerOptions`](../type-aliases/ServerOptions.md) = `{}`

Server configuration overrides.

#### Returns

`Server`

Server instance.

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Close server.

#### Returns

`Promise`\<`void`\>

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

### listen()

> **listen**(): `Server`

Start server.

#### Returns

`Server`

### middleware()

> **middleware**(`req`, `res`, `next`): `Promise`\<`void`\>

Middleware function to handle incoming HTTP requests.

#### Parameters

##### req

`IncomingMessage`

The incoming HTTP request object.

##### res

`ServerResponse`\<`IncomingMessage`\>

The server response object.

##### next

() => `void`

A callback function to pass control to the next middleware.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the middleware processing is complete.

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

Normalized project root used to resolve route files.
