[@faasjs/node-utils](../README.md) / colorfy

# Function: colorfy()

> **colorfy**(`level`, `message`): `string`

Wrap a log message with the ANSI foreground color for a log level.

## Parameters

### level

[`Level`](../type-aliases/Level.md)

Log level used to select the foreground color.

### message

`string`

Plain text message to colorize.

## Returns

`string`

Message wrapped in ANSI color escape sequences.

## Example

```ts
import { colorfy } from '@faasjs/node-utils'

console.log(colorfy('warn', 'Low disk space'))
```
