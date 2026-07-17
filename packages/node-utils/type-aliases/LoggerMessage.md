[**@faasjs/node-utils**](../README.md)

[@faasjs/node-utils](../README.md) / LoggerMessage

# Type Alias: LoggerMessage

> **LoggerMessage** = `object`

Serialized log entry sent to transport handlers.

[Logger](../classes/Logger.md) creates these messages after formatting and before writing to
stdout or stderr.

## Properties

### extra?

> `optional` **extra?**: `any`[]

Original extra values forwarded alongside the formatted message, including
hidden metadata such as timer performance data.

### labels

> **labels**: `string`[]

Label segments captured from the logger label.

A label such as `app] [config` becomes `['app', 'config']`.

### level

> **level**: [`Level`](Level.md)

Log level that produced the message.

### message

> **message**: `string`

Fully formatted log text.

### timestamp

> **timestamp**: `number`

Unix timestamp in milliseconds for when the entry was created.
