[@faasjs/node-utils](../README.md) / TransportOptions

# Type Alias: TransportOptions

> **TransportOptions** = `object`

Options for configuring the shared logger transport.

## Properties

### debug?

> `optional` **debug?**: `boolean`

When true, the transport's internal logger emits debug diagnostics.

#### Default

```ts
false
```

### interval?

> `optional` **interval?**: `number`

Flush interval in milliseconds.

#### Default

```ts
5000
```

### label?

> `optional` **label?**: `string`

Label used by the transport's internal [Logger](../classes/Logger.md).

#### Default

```ts
'LoggerTransport'
```
