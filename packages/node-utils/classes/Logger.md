[**@faasjs/node-utils**](../README.md)

[@faasjs/node-utils](../README.md) / Logger

# Class: Logger

Write level-filtered log output with optional labels, colors, timers, and transport forwarding.

When `process` is available, the constructor reads `FaasLog`, `FaasLogMode`, `FaasLogSize`,
and `FaasLogTransport` to derive the initial logger behavior.

Defaults are `level = 'info'`, `size = 1000`, shared transport forwarding enabled outside Vitest,
and colorized output auto-detected from `FORCE_COLOR`, `NO_COLOR`, `TERM`, and `process.stdout.isTTY`.
Use `FaasLogMode=plain` to force plain output and `FaasLogMode=pretty` to force ANSI colors.

## See

[getTransport](../functions/getTransport.md)

## Example

```ts
import { Logger } from '@faasjs/node-utils'

const logger = new Logger()

logger.debug('debug message')
logger.info('info message')
logger.warn('warn message')
logger.error('error message')

logger.time('timer name')
logger.timeEnd('timer name', 'message') // => 'message +1ms'
```

## Constructors

### Constructor

> **new Logger**(`label?`): `Logger`

Create a logger with an optional label prefix.

Environment variables are read only during construction:
`FaasLog=debug|info|warn|error`, `FaasLogMode=plain|pretty`,
`FaasLogSize=<number>`, and `FaasLogTransport=true|false`.

#### Parameters

##### label?

`string`

Prefix label shown in log output.

#### Returns

`Logger`

## Methods

### debug()

> **debug**(`message`, ...`args`): `Logger`

Write a debug log entry.

#### Parameters

##### message

`string`

Log message or format string.

##### args

...`any`[]

Additional values forwarded to the formatter.

#### Returns

`Logger`

The current logger for chaining.

### error()

> **error**(`message`, ...`args`): `Logger`

Write an error log entry.

#### Parameters

##### message

`unknown`

Log message, format string, or `Error` object.

##### args

...`any`[]

Additional values forwarded to the formatter.

#### Returns

`Logger`

The current logger for chaining.

### info()

> **info**(`message`, ...`args`): `Logger`

Write an info log entry.

#### Parameters

##### message

`string`

Log message or format string.

##### args

...`any`[]

Additional values forwarded to the formatter.

#### Returns

`Logger`

The current logger for chaining.

### raw()

> **raw**(`message`, ...`args`): `Logger`

Write raw output without adding log level prefixes.

Raw output still respects [Logger.silent](#silent), but it does not apply level
filtering, colorization, truncation, labels, or transport forwarding.

#### Parameters

##### message

`string`

Log message or format string.

##### args

...`any`[]

Additional values forwarded to the formatter.

#### Returns

`Logger`

The current logger for chaining.

### time()

> **time**(`key`, `level?`): `Logger`

Start a named timer that will log its duration when ended.

#### Parameters

##### key

`string`

Unique identifier for the timer.

##### level?

[`Level`](../type-aliases/Level.md) = `'debug'`

Log level used when the timer ends.

#### Returns

`Logger`

The current logger for chaining.

#### Default

```ts
'debug'
```

### timeEnd()

> **timeEnd**(`key`, `message`, ...`args`): `Logger`

Stop a named timer and log the elapsed duration.

If the timer key does not exist, the logger emits a warning and then writes
the provided message at debug level.

#### Parameters

##### key

`string`

Unique identifier for the timer.

##### message

`string`

Message to log alongside the elapsed time.

##### args

...`any`[]

Additional values forwarded to the formatter.

#### Returns

`Logger`

The current logger for chaining.

### warn()

> **warn**(`message`, ...`args`): `Logger`

Write a warning log entry.

#### Parameters

##### message

`string`

Log message or format string.

##### args

...`any`[]

Additional values forwarded to the formatter.

#### Returns

`Logger`

The current logger for chaining.

## Properties

### colorizeOutput

> **colorizeOutput**: `boolean` = `false`

Whether terminal output should use ANSI colors.

The constructor auto-detects this from the current environment and can be
overridden with `FaasLogMode`.

#### Default

```ts
false
```

### disableTransport

> **disableTransport**: `boolean` = `false`

Disable forwarding log messages to the shared transport.

The constructor sets this to `true` in Vitest unless `FaasLogTransport=true`,
and also when `FaasLogTransport=false`.

#### Default

```ts
false
```

### label?

> `optional` **label?**: `string`

Optional label prefix included in log lines.

### level

> **level**: [`Level`](../type-aliases/Level.md) = `'info'`

Minimum level that will be emitted.

The constructor overrides this from `FaasLog` when present.

#### Default

```ts
'info'
```

### silent

> **silent**: `boolean` = `false`

When true, suppresses all output and transport forwarding.

#### Default

```ts
false
```

### size

> **size**: `number` = `1000`

Maximum plain-text payload length before debug and info logs are truncated.

#### Default

```ts
1000
```

### stderr

> **stderr**: (`text`) => `void` = `console.error`

Output function used for error logs.

#### Parameters

##### text

`string`

#### Returns

`void`

#### Default

```ts
console.error
```

### stdout

> **stdout**: (`text`) => `void` = `console.log`

Output function used for non-error logs.

#### Parameters

##### text

`string`

#### Returns

`void`

#### Default

```ts
console.log
```
