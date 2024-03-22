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

### new Server(root, opts)

> **new Server**(`root`, `opts`?): [`Server`](Server.md)

#### Parameters

• **root**: `string`

Project path

• **opts?**

Options

• **opts\.cache?**: `boolean`

Enable cache, default is false

• **opts\.onError?**

• **opts\.port?**: `number`

Port, default is 3000

#### Returns

[`Server`](Server.md)

## Properties

### logger

> **`readonly`** **logger**: `Logger`

### onError()?

> **`optional`** **onError**: (`error`) => `void`

#### Parameters

• **error**: `Error`

#### Returns

`void`

### opts

> **`readonly`** **opts**: `Object`

#### cache

> **cache**: `boolean`

#### port

> **port**: `number`

### root

> **`readonly`** **root**: `string`

## Methods

### close()

> **close**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### listen()

> **listen**(): `Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>

Start server.

#### Returns

`Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>

### processRequest()

> **processRequest**(`path`, `req`, `res`, `requestedAt`): `Promise`\<`void`\>

#### Parameters

• **path**: `string`

• **req**: `IncomingMessage`

• **res**: `ServerResponse`\<`IncomingMessage`\> & `Object`

• **requestedAt**: `number`

#### Returns

`Promise`\<`void`\>
