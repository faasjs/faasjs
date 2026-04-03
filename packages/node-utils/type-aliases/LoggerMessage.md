[@faasjs/node-utils](../README.md) / LoggerMessage

# Type Alias: LoggerMessage

> **LoggerMessage** = `object`

Serialized log entry sent to transport handlers.

## Properties

### extra?

> `optional` **extra?**: `any`[]

Original extra values forwarded alongside the formatted message.

### labels

> **labels**: `string`[]

Label segments captured from the logger.

### level

> **level**: [`Level`](Level.md)

Log level that produced the message.

### message

> **message**: `string`

Fully formatted log text.

### timestamp

> **timestamp**: `number`

Unix timestamp in milliseconds for when the entry was created.
