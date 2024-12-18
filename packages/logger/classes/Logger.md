[@faasjs/logger](../README.md) / Logger

# Class: Logger

Logger Class

Support env:
- FaasLog: debug, info, warn, error (default: debug)
- FaasLogSize: 1000 (default: 1000)
- FaasLogMode: plain, pretty (default: pretty)

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

### colorfy()

> **colorfy**(`color`, `message`): `string`

#### Parameters

##### color

`number`

{number} color code

##### message

`string`

{string} message

#### Returns

`string`

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

#### Parameters

##### key

`string`

{string} timer's label

##### level

[`Level`](../type-aliases/Level.md) = `'debug'`

[string=debug] 日志级别，支持 debug、info、warn、error

#### Returns

[`Logger`](Logger.md)

### timeEnd()

> **timeEnd**(`key`, `message`, ...`args`): [`Logger`](Logger.md)

#### Parameters

##### key

`string`

{string} timer's label

##### message

`string`

{string} message

##### args

...`any`[]

{...any=} arguments

#### Returns

[`Logger`](Logger.md)

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

### label?

> `optional` **label**: `string`

### level

> **level**: `number` = `0`

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
