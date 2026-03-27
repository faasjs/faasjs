[@faasjs/node-utils](../README.md) / Logger

# Class: Logger

Logger with optional labels, colorized output, and transport forwarding.

## Example

```ts
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

Logger instance for chaining.

### error()

> **error**(`message`, ...`args`): `Logger`

Write an error log entry.

#### Parameters

##### message

`unknown`

Log message, format string, or Error object.

##### args

...`any`[]

Additional values forwarded to the formatter.

#### Returns

`Logger`

Logger instance for chaining.

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

Logger instance for chaining.

### raw()

> **raw**(`message`, ...`args`): `Logger`

Write raw output without adding log level prefixes.

#### Parameters

##### message

`string`

Log message or format string.

##### args

...`any`[]

Additional values forwarded to the formatter.

#### Returns

`Logger`

Logger instance for chaining.

### time()

> **time**(`key`, `level?`): `Logger`

Start a timer with a specific key and log level.

#### Parameters

##### key

`string`

The unique identifier for the timer.

##### level?

[`Level`](../type-aliases/Level.md) = `'debug'`

The log level for the timer. Defaults to 'debug'.

#### Returns

`Logger`

The Logger instance for chaining.

### timeEnd()

> **timeEnd**(`key`, `message`, ...`args`): `Logger`

End a timer with a specific key and log the elapsed time.

#### Parameters

##### key

`string`

The unique identifier for the timer.

##### message

`string`

The message to log with the elapsed time.

##### args

...`any`[]

Additional arguments to log with the message.

#### Returns

`Logger`

The Logger instance for chaining.

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

Logger instance for chaining.

## Properties

### colorfyOutput

> **colorfyOutput**: `boolean` = `true`

Whether terminal output should use ANSI colors.

### disableTransport

> **disableTransport**: `boolean` = `false`

Disable forwarding log messages to the shared transport.

### label?

> `optional` **label?**: `string`

Optional label prefix included in log lines.

### level

> **level**: [`Level`](../type-aliases/Level.md) = `'debug'`

Minimum level that will be printed.

### silent

> **silent**: `boolean` = `false`

When true, suppresses all output.

### size

> **size**: `number` = `1000`

Maximum serialized payload size used by the formatter.

### stderr

> **stderr**: (`text`) => `void` = `console.error`

Output function used for error logs.

#### Parameters

##### text

`string`

#### Returns

`void`

### stdout

> **stdout**: (`text`) => `void` = `console.log`

Output function used for non-error logs.

#### Parameters

##### text

`string`

#### Returns

`void`
