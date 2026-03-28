[@faasjs/core](../README.md) / ServerOptions

# Type Alias: ServerOptions

> **ServerOptions** = `object`

Configuration options for [Server](../classes/Server.md).

## Properties

### beforeHandle?

> `optional` **beforeHandle?**: [`Middleware`](Middleware.md)

Middleware invoked before each request is dispatched to a FaasJS function.

Write to the response to short-circuit normal request handling.

#### Example

```ts
const server = new Server(process.cwd(), {
  beforeHandle: async (req, res) => {
    console.log(`Processing ${req.method} request to ${req.url}`)

    if (req.method !== 'POST') res.writeHead(405, { Allow: 'POST' })
  },
})
```

### cronJob?

> `optional` **cronJob?**: `boolean`

Whether to mount cron job lifecycle with this server instance.

When enabled, `server.listen()` mounts registered cron jobs and
`server.close()` unmounts them.

#### Default

```ts
true
```

### onClose?

> `optional` **onClose?**: (`context`) => `Promise`\<`void`\>

Async hook invoked after the server closes.

Use this hook for cleanup or shutdown logging.

#### Parameters

##### context

Lifecycle context passed to the close hook.

###### logger

`Logger`

Shared server logger instance.

#### Returns

`Promise`\<`void`\>

Promise returned by the close hook.

#### Example

```ts
const server = new Server(process.cwd(), {
  onClose: async ({ logger }) => {
    logger.info('Server closed')
  },
})
```

### onError?

> `optional` **onError?**: (`error`, `context`) => `Promise`\<`void`\>

Async hook invoked when server-level errors occur.

This hook receives normalized `Error` instances.

#### Parameters

##### error

`Error`

Error raised during server operation.

##### context

Lifecycle context passed to the error hook.

###### logger

`Logger`

Shared server logger instance.

#### Returns

`Promise`\<`void`\>

Promise returned by the error hook.

#### Example

```ts
const server = new Server(process.cwd(), {
  onError: async (error, { logger }) => {
    logger.error(error)
  },
})
```

### onStart?

> `optional` **onStart?**: (`context`) => `Promise`\<`void`\>

Async hook invoked after the server starts listening.

Errors thrown by this hook are reported through the server error logger.

#### Parameters

##### context

Lifecycle context passed to the start hook.

###### logger

`Logger`

Shared server logger instance.

#### Returns

`Promise`\<`void`\>

Promise returned by the start hook.

#### Example

```ts
const server = new Server(process.cwd(), {
  onStart: async ({ logger }) => {
    logger.info('Server started')
  },
})
```

### port?

> `optional` **port?**: `number`

Port used by [Server.listen](../classes/Server.md#listen).

#### Default

```ts
3000
```
