[@faasjs/server](../README.md) / Server

# Class: Server

FaasJS Server.

## Param

The root path of the server.

## Param

The options of the server.

## Example

```ts
import { Server } from '@faasjs/server'

const server = new Server(process.cwd(), {
  port: 8080,
})

server.listen()
```

## Constructors

### new Server()

> **new Server**(`root`, `opts`?): `Server`

#### Parameters

##### root

`string`

##### opts?

[`ServerOptions`](../type-aliases/ServerOptions.md)

#### Returns

`Server`

## Methods

### close()

> **close**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### listen()

> **listen**(): `Server`

Start server.

#### Returns

`Server`

### processRequest()

> **processRequest**(`path`, `req`, `res`, `requestedAt`): `Promise`\<`void`\>

#### Parameters

##### path

`string`

##### req

`IncomingMessage`

##### res

`ServerResponse`\<`IncomingMessage`\> & `object`

##### requestedAt

`number`

#### Returns

`Promise`\<`void`\>

## Properties

### closed

> `protected` **closed**: `boolean` = `false`

### logger

> `readonly` **logger**: `Logger`

### options

> `readonly` **options**: [`ServerOptions`](../type-aliases/ServerOptions.md)

### root

> `readonly` **root**: `string`
