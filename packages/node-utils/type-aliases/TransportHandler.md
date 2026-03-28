[@faasjs/node-utils](../README.md) / TransportHandler

# Type Alias: TransportHandler

> **TransportHandler** = (`messages`) => `Promise`\<`void`\>

Async callback used by [Transport](../classes/Transport.md) to flush buffered log messages.

## Parameters

### messages

[`LoggerMessage`](LoggerMessage.md)[]

Buffered messages being flushed together.

## Returns

`Promise`\<`void`\>

Promise that resolves when the batch has been processed.
