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

### Constructor

> **new Logger**(`label?`): `Logger`

#### Parameters

##### label?

`string`

{string} Prefix label

#### Returns

`Logger`

## Methods

### debug()

> **debug**(`message`, ...`args`): `Logger`

#### Parameters

##### message

`string`

{string} message

##### args

...`any`[]

{...any=} arguments

#### Returns

`Logger`

### error()

> **error**(`message`, ...`args`): `Logger`

#### Parameters

##### message

`unknown`

{any} message or Error object

##### args

...`any`[]

{...any=} arguments

#### Returns

`Logger`

### info()

> **info**(`message`, ...`args`): `Logger`

#### Parameters

##### message

`string`

{string} message

##### args

...`any`[]

{...any=} arguments

#### Returns

`Logger`

### raw()

> **raw**(`message`, ...`args`): `Logger`

#### Parameters

##### message

`string`

{string} message

##### args

...`any`[]

{...any=} arguments

#### Returns

`Logger`

### time()

> **time**(`key`, `level`): `Logger`

Start a timer with a specific key and log level.

#### Parameters

##### key

`string`

The unique identifier for the timer.

##### level

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

#### Parameters

##### message

`string`

{string} message

##### args

...`any`[]

{...any=} arguments

#### Returns

`Logger`

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

> **stderr**: (`text`) => `void` = `console.error`

#### Parameters

##### text

`string`

#### Returns

`void`

### stdout()

> **stdout**: (`text`) => `void` = `console.log`

#### Parameters

##### text

`string`

#### Returns

`void`
