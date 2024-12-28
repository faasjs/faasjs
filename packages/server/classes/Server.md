[@faasjs/server](../README.md) / Server

# Class: Server

FaasJS Server.

```ts
const server = new Server(process.cwd(), {
 port: 8080,
 cache: false,
})

server.listen()
```

## Constructors

### new Server()

> **new Server**(`root`, `opts`?): [`Server`](Server.md)

#### Parameters

##### root

`string`

Project path

##### opts?

Options

###### cache

`boolean`

Enable cache, default is false

###### onClose

() => `Promise`\<`void`\>

###### onError

(`error`) => `void`

###### port

`number`

Port, default is 3000

#### Returns

[`Server`](Server.md)

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

`ServerResponse` & `object`

##### requestedAt

`number`

#### Returns

`Promise`\<`void`\>

## Properties

### closed

> `protected` **closed**: `boolean` = `false`

### logger

> `readonly` **logger**: `Logger`

### onClose()?

> `readonly` `optional` **onClose**: () => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### onError()

> `readonly` **onError**: (`error`) => `void`

#### Parameters

##### error

`any`

#### Returns

`void`

### opts

> `readonly` **opts**: `object`

#### cache

> **cache**: `boolean`

#### port

> **port**: `number`

### root

> `readonly` **root**: `string`

### runtime

> `readonly` **runtime**: `"esm"` \| `"cjs"` \| `"bun"`
