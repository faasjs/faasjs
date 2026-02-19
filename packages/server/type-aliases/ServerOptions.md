[@faasjs/server](../README.md) / ServerOptions

# Type Alias: ServerOptions

> **ServerOptions** = `object`

Configuration options for the server.

## Properties

### beforeHandle?

> `optional` **beforeHandle**: [`Middleware`](Middleware.md)

Callback function that is invoked before handling each request.

This function is executed asynchronously before the main request handling logic.
It can be used for request preprocessing, authentication, logging, etc.

#### Param

The incoming HTTP request object.

#### Param

The server response object.

#### Example

```typescript
const server = new Server(process.cwd(), {
  beforeHandle: async (req, res) => {
    console.log(`Processing ${req.method} request to ${req.url}`)

    if (req.method !== 'POST') res.writeHead(405, { Allow: 'POST' }) // If you write response, it will finish the request
  },
})
```

### onClose()?

> `optional` **onClose**: (`context`) => `Promise`\<`void`\>

Callback function that is invoked when the server is closed.

This function is executed asynchronously and can be used to perform
cleanup tasks or log server shutdown events.

#### Parameters

##### context

An object containing the logger instance.

###### logger

`Logger`

#### Returns

`Promise`\<`void`\>

#### Example

```typescript
const server = new Server(process.cwd(), {
  onClose: async ({ logger }) => {
    logger.info('Server closed')
  },
})
```

### onError()?

> `optional` **onError**: (`error`, `context`) => `Promise`\<`void`\>

Callback function that is invoked when an error occurs.

This function is executed asynchronously and allows handling of errors
that occur during server operation.

#### Parameters

##### error

`Error`

The error that occurred.

##### context

An object containing the logger instance.

###### logger

`Logger`

#### Returns

`Promise`\<`void`\>

#### Example

```typescript
const server = new Server(process.cwd(), {
  onError: async (error, { logger }) => {
    logger.error(error)
  },
})
```

### onStart()?

> `optional` **onStart**: (`context`) => `Promise`\<`void`\>

Callback function that is invoked when the server starts.

This function is executed asynchronously and will not interrupt the server
if an error occurs during its execution.

#### Parameters

##### context

An object containing the logger instance.

###### logger

`Logger`

#### Returns

`Promise`\<`void`\>

#### Example

```typescript
const server = new Server(process.cwd(), {
  onStart: async ({ logger }) => {
    logger.info('Server started')
  },
})
```

### port?

> `optional` **port**: `number`

The port on which the server will listen. Defaults to `3000` if not provided.

#### Default

```ts
3000
```
