[@faasjs/node-utils](../README.md) / colorize

# Function: colorize()

> **colorize**(`level`, `message`): `string`

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
import { colorize } from '@faasjs/node-utils'

console.log(colorize('warn', 'Low disk space'))
```
