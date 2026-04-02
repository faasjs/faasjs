[@faasjs/node-utils](../README.md) / Transport

# Class: Transport

Buffer log messages and flush them to registered async handlers on an interval.

Use [getTransport](../functions/getTransport.md) to access the shared singleton that [Logger](Logger.md) writes into by default.

## See

[getTransport](../functions/getTransport.md)

## Example

```ts
import { getTransport } from '@faasjs/node-utils'

const transport = getTransport()

transport.register('test', async (messages) => {
  for (const { level, message } of messages) console.log(level, message)
})

transport.config({ label: 'test', debug: true })

// If you use Logger, it will automatically insert messages into the transport.
// Otherwise, you can insert messages manually.
transport.insert({
  level: 'info',
  labels: ['server'],
  message: 'test message',
  timestamp: Date.now(),
})

process.on('SIGINT', async () => {
  await transport.stop()
  process.exit(0)
})
```

## Constructors

### Constructor

> **new Transport**(): `Transport`

Create the shared transport and start its flush interval.

#### Returns

`Transport`

## Methods

### config()

> **config**(`options`): `void`

Update runtime options for the shared transport logger.

Calling this method also re-enables a previously disabled transport.

#### Parameters

##### options

[`TransportOptions`](../type-aliases/TransportOptions.md)

Transport configuration such as label, flush interval, and debug mode.

#### Returns

`void`

---

### flush()

> **flush**(): `Promise`\<`void`\>

Flush the current message buffer through every registered handler.

Concurrent callers wait for the active flush to finish. If no handlers are registered, the transport clears
the buffered messages, disables itself, and stops the interval until reconfigured.

#### Returns

`Promise`\<`void`\>

Promise that resolves after the active flush completes.

---

### insert()

> **insert**(`message`): `void`

Queue a formatted log message for the next flush.

This is a no-op when the transport is disabled.

#### Parameters

##### message

[`LoggerMessage`](../type-aliases/LoggerMessage.md)

Log message to buffer.

#### Returns

`void`

---

### register()

> **register**(`name`, `handler`): `void`

Register a named flush handler.

Registering the same name again replaces the previous handler.

#### Parameters

##### name

`string`

Transport handler name.

##### handler

[`TransportHandler`](../type-aliases/TransportHandler.md)

Async handler invoked for each flushed batch.

#### Returns

`void`

---

### reset()

> **reset**(): `void`

Clear handlers and buffered messages without destroying the singleton instance.

This also clears the interval so tests or setup code can reconfigure the transport from a clean state.

#### Returns

`void`

---

### stop()

> **stop**(): `Promise`\<`void`\>

Stop periodic flushing and drain any buffered messages.

#### Returns

`Promise`\<`void`\>

Promise that resolves when the transport has fully stopped.

---

### unregister()

> **unregister**(`name`): `void`

Remove a named handler from the transport.

When the last handler is removed, the transport stops accepting new messages until it is re-enabled.

#### Parameters

##### name

`string`

Transport handler name to remove.

#### Returns

`void`

## Properties

### handlers

> **handlers**: `Map`\<`string`, [`TransportHandler`](../type-aliases/TransportHandler.md)\>

Registered flush handlers keyed by name.

---

### messages

> **messages**: [`LoggerMessage`](../type-aliases/LoggerMessage.md)[] = `[]`

Buffered messages waiting to be flushed.
