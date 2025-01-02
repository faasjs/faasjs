[@faasjs/logger](../README.md) / Transport

# Class: Transport

The transport class that manages the transport handlers and log messages.

**Note: This class is not meant to be used directly. Use the [getTransport](../functions/getTransport.md) instead.**

## Example

```typescript
import { getTransport } from '@faasjs/logger'

const transport = getTransport()

transport.register('test', async (messages) => {
 for (const { level, message } of messages)
   console.log(level, message)
})

transport.config({ label: 'test', debug: true })

// If you using Logger, it will automatically insert messages to the transport.
// Otherwise, you can insert messages manually.
transport.insert({
  level: 'info',
  labels: ['server'],
  message: 'test message',
  timestamp: Date.now()
})

process.on('SIGINT', async () => {
  await transport.stop()
  process.exit(0)
})
```

## Constructors

### new Transport()

> **new Transport**(): [`Transport`](Transport.md)

#### Returns

[`Transport`](Transport.md)

## Methods

### config()

> **config**(`options`): `void`

Configure the transport options for the logger.

#### Parameters

##### options

[`TransportOptions`](../type-aliases/TransportOptions.md)

The configuration options for the transport.

#### Returns

`void`

### flush()

> **flush**(): `Promise`\<`void`\>

Flushes the current messages by processing them with the registered handlers.

If the transport is already flushing, it will wait until the current flush is complete.
If the transport is disabled or there are no messages to flush, it will return immediately.
If there are no handlers registered, it will log a warning, clear the messages, disable the transport, and stop the interval.

The method processes all messages with each handler and logs any errors encountered during the process.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the flush operation is complete.

### insert()

> **insert**(`message`): `void`

Inserts a log message into the transport if it is enabled.

#### Parameters

##### message

[`LoggerMessage`](../type-aliases/LoggerMessage.md)

The log message to be inserted.

#### Returns

`void`

### register()

> **register**(`name`, `handler`): `void`

Registers a new transport handler.

#### Parameters

##### name

`string`

The name of the transport handler.

##### handler

[`TransportHandler`](../type-aliases/TransportHandler.md)

The transport handler function to be registered.

#### Returns

`void`

### reset()

> **reset**(): `void`

Resets the transport by clearing handlers, emptying messages, and re-enabling the transport.
If an interval is set, it will be cleared.

#### Returns

`void`

### stop()

> **stop**(): `Promise`\<`void`\>

Stops the logger transport.

This method performs the following actions:
1. Logs a 'stopping' message.
2. Clears the interval if it is set.
3. Flushes any remaining logs.
4. Disables the transport.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the transport has been stopped.

### unregister()

> **unregister**(`name`): `void`

Unregister a handler by its name.

This method logs the unregistration process, removes the handler from the internal collection,
and disables the logger if no handlers remain.

#### Parameters

##### name

`string`

The name of the handler to unregister.

#### Returns

`void`

## Properties

### handlers

> **handlers**: `Map`\<`string`, [`TransportHandler`](../type-aliases/TransportHandler.md)\>

### messages

> **messages**: [`LoggerMessage`](../type-aliases/LoggerMessage.md)[] = `[]`
