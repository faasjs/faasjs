# Class: Logger

Logger Class

```ts
const logger = new Logger()

logger.debug('debug message')
logger.info('info message')
logger.warn('warn message')
logger.error('error message')

logger.time('timer name')
logger.timeEnd('timer name', 'message') // => 'message +1ms'
```

## Table of contents

### Constructors

- [constructor](Logger.md#constructor)

### Properties

- [colorfyOutput](Logger.md#colorfyoutput)
- [label](Logger.md#label)
- [level](Logger.md#level)
- [silent](Logger.md#silent)
- [size](Logger.md#size)
- [stderr](Logger.md#stderr)
- [stdout](Logger.md#stdout)

### Methods

- [colorfy](Logger.md#colorfy)
- [debug](Logger.md#debug)
- [error](Logger.md#error)
- [info](Logger.md#info)
- [raw](Logger.md#raw)
- [time](Logger.md#time)
- [timeEnd](Logger.md#timeend)
- [warn](Logger.md#warn)

## Constructors

### constructor

• **new Logger**(`label?`): [`Logger`](Logger.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `label?` | `string` | {string} Prefix label |

#### Returns

[`Logger`](Logger.md)

## Properties

### colorfyOutput

• **colorfyOutput**: `boolean` = `true`

___

### label

• `Optional` **label**: `string`

___

### level

• **level**: `number`

___

### silent

• **silent**: `boolean`

___

### size

• `Optional` **size**: `number`

size of log message, default 1000, set 0 to disable

env: FaasLogSize

___

### stderr

• **stderr**: (`text`: `string`) => `void`

#### Type declaration

▸ (`text`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

##### Returns

`void`

___

### stdout

• **stdout**: (`text`: `string`) => `void`

#### Type declaration

▸ (`text`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

##### Returns

`void`

## Methods

### colorfy

▸ **colorfy**(`color`, `message`): `string`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color` | `number` | {number} color code |
| `message` | `string` | {string} message |

#### Returns

`string`

___

### debug

▸ **debug**(`message`, `...args`): [`Logger`](Logger.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | {string} message |
| `...args` | `any`[] | {...any=} arguments |

#### Returns

[`Logger`](Logger.md)

___

### error

▸ **error**(`message`, `...args`): [`Logger`](Logger.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` \| `Error` | {any} message or Error object |
| `...args` | `any`[] | {...any=} arguments |

#### Returns

[`Logger`](Logger.md)

___

### info

▸ **info**(`message`, `...args`): [`Logger`](Logger.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | {string} message |
| `...args` | `any`[] | {...any=} arguments |

#### Returns

[`Logger`](Logger.md)

___

### raw

▸ **raw**(`message`, `...args`): [`Logger`](Logger.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | {string} message |
| `...args` | `any`[] | {...any=} arguments |

#### Returns

[`Logger`](Logger.md)

___

### time

▸ **time**(`key`, `level?`): [`Logger`](Logger.md)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | `string` | `undefined` | {string} timer's label |
| `level` | [`Level`](../#level) | `'debug'` | [string=debug] 日志级别，支持 debug、info、warn、error |

#### Returns

[`Logger`](Logger.md)

___

### timeEnd

▸ **timeEnd**(`key`, `message`, `...args`): [`Logger`](Logger.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | {string} timer's label |
| `message` | `string` | {string} message |
| `...args` | `any`[] | {...any=} arguments |

#### Returns

[`Logger`](Logger.md)

___

### warn

▸ **warn**(`message`, `...args`): [`Logger`](Logger.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | {string} message |
| `...args` | `any`[] | {...any=} arguments |

#### Returns

[`Logger`](Logger.md)
