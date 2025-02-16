[@faasjs/logger](../README.md) / Logger

# Class: Logger

Logger Class

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

### new Logger()

> **new Logger**(`label`?): [`Logger`](Logger.md)

#### Parameters

##### label?

`string`

{string} Prefix label

#### Returns

[`Logger`](Logger.md)

## Methods

### debug()

> **debug**(`message`, ...`args`): [`Logger`](Logger.md)

#### Parameters

##### message

`string`

{string} message

##### args

...`any`[]

{...any=} arguments

#### Returns

[`Logger`](Logger.md)

### error()

> **error**(`message`, ...`args`): [`Logger`](Logger.md)

#### Parameters

##### message

{any} message or Error object

`string` | `Error`

##### args

...`any`[]

{...any=} arguments

#### Returns

[`Logger`](Logger.md)

### info()

> **info**(`message`, ...`args`): [`Logger`](Logger.md)

#### Parameters

##### message

`string`

{string} message

##### args

...`any`[]

{...any=} arguments

#### Returns

[`Logger`](Logger.md)

### raw()

> **raw**(`message`, ...`args`): [`Logger`](Logger.md)

#### Parameters

##### message

`string`

{string} message

##### args

...`any`[]

{...any=} arguments

#### Returns

[`Logger`](Logger.md)

### time()

> **time**(`key`, `level`): [`Logger`](Logger.md)

Start a timer with a specific key and log level.

#### Parameters

##### key

`string`

The unique identifier for the timer.

##### level

[`Level`](../type-aliases/Level.md) = `'debug'`

The log level for the timer. Defaults to 'debug'.

#### Returns

[`Logger`](Logger.md)

The Logger instance for chaining.

### timeEnd()

> **timeEnd**(`key`, `message`, ...`args`): [`Logger`](Logger.md)

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

[`Logger`](Logger.md)

The Logger instance for chaining.

### warn()

> **warn**(`message`, ...`args`): [`Logger`](Logger.md)

#### Parameters

##### message

`string`

{string} message

##### args

...`any`[]

{...any=} arguments

#### Returns

[`Logger`](Logger.md)

## Properties

### colorfyOutput

> **colorfyOutput**: `boolean` = `true`

### disableTransport

> **disableTransport**: `boolean` = `false`

### label?

> `optional` **label**: `string`

### level

> **level**: [`Level`](../type-aliases/Level.md) = `'debug'`

### silent

> **silent**: `boolean` = `false`

### size

> **size**: `number` = `1000`

### stderr()

> **stderr**: (`text`) => `void`

#### Parameters

##### text

`string`

#### Returns

`void`

### stdout()

> **stdout**: (`text`) => `void`

#### Parameters

##### text

`string`

#### Returns

`void`
