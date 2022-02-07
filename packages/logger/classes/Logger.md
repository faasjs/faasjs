# Class: Logger

Logger Class

```ts
const logger = new Logger()
logger.debug('debug message')
logger.info('info message')
logger.warn('warn message')
logger.error('error message')

logger.time('timer name')
logger.timeEnd('timer name', 'message') // 'message +1ms'
```

## Table of contents

### Constructors

- [constructor](Logger.md#constructor)

### Properties

- [colorfyOutput](Logger.md#colorfyoutput)
- [label](Logger.md#label)
- [level](Logger.md#level)
- [silent](Logger.md#silent)
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

• **new Logger**(`label?`)

初始化日志

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `label?` | `string` | 日志前缀 |

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

文本染色

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color` | `number` | 颜色代码 |
| `message` | `string` | 文本内容 |

#### Returns

`string`

___

### debug

▸ **debug**(`message`, ...`args`): [`Logger`](Logger.md)

调试级别日志

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | 日志内容 |
| `...args` | `any`[] | 内容参数 |

#### Returns

[`Logger`](Logger.md)

___

### error

▸ **error**(`message`, ...`args`): [`Logger`](Logger.md)

错误级别日志

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` \| `Error` | 日志内容，可以为 Error 对象 |
| `...args` | `any`[] | 内容参数 |

#### Returns

[`Logger`](Logger.md)

___

### info

▸ **info**(`message`, ...`args`): [`Logger`](Logger.md)

信息级别日志

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | 日志内容 |
| `...args` | `any`[] | 内容参数 |

#### Returns

[`Logger`](Logger.md)

___

### raw

▸ **raw**(`message`, ...`args`): [`Logger`](Logger.md)

纯输出日志

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | 日志内容 |
| `...args` | `any`[] | 内容参数 |

#### Returns

[`Logger`](Logger.md)

___

### time

▸ **time**(`key`, `level?`): [`Logger`](Logger.md)

设置一个计时器

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | `string` | `undefined` | 计时器标识 |
| `level` | [`Level`](../#level) | `'debug'` | 日志级别，支持 debug、info、warn、error |

#### Returns

[`Logger`](Logger.md)

___

### timeEnd

▸ **timeEnd**(`key`, `message`, ...`args`): [`Logger`](Logger.md)

结束计时并显示日志

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | 计时器标识 |
| `message` | `string` | 日志内容 |
| `...args` | `any`[] | 内容参数 |

#### Returns

[`Logger`](Logger.md)

___

### warn

▸ **warn**(`message`, ...`args`): [`Logger`](Logger.md)

警告级别日志

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | 日志内容 |
| `...args` | `any`[] | 内容参数 |

#### Returns

[`Logger`](Logger.md)
