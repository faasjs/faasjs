[@faasjs/server](../README.md) / ServerOptions

# Type Alias: ServerOptions

> **ServerOptions**: `object`

Options for configuring the server.

## Type declaration

### onClose()?

> `optional` **onClose**: (`context`) => `Promise`\<`void`\>

Callback function that is called when the server is closed.

#### Parameters

##### context

The context object containing the logger.

###### logger

`Logger`

#### Returns

`Promise`\<`void`\>

#### Example

```ts
const server = new Server(process.cwd(), {
  onClose: async ({ logger }) => {
    logger.info('Server closed')
  })
})
```

### onError()?

> `optional` **onError**: (`error`, `context`) => `Promise`\<`void`\>

Callback function that is called when an error occurs.

#### Parameters

##### error

`Error`

The error that occurred.

##### context

The context object containing the logger.

###### logger

`Logger`

#### Returns

`Promise`\<`void`\>

#### Example

```ts
const server = new Server(process.cwd(), {
  onError: async (error, { logger }) => {
    logger.error(error)
  })
})
```

### onStart()?

> `optional` **onStart**: (`context`) => `Promise`\<`void`\>

Callback function that is called when the server starts.

Note: It will not break the server if an error occurs.

#### Parameters

##### context

The context object containing the logger.

###### logger

`Logger`

#### Returns

`Promise`\<`void`\>

#### Example

```ts
const server = new Server(process.cwd(), {
  onStart: async ({ logger }) => {
    logger.info('Server started')
  })
})
```

### port?

> `optional` **port**: `number`

The port on which the server will listen.

#### Default

```ts
3000
```
