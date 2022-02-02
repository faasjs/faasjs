# Class: Logger

日志类

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

#### Defined in

[index.ts:43](https://github.com/faasjs/faasjs/blob/1705fd2/packages/logger/src/index.ts#L43)

## Properties

### colorfyOutput

• **colorfyOutput**: `boolean` = `true`

#### Defined in

[index.ts:33](https://github.com/faasjs/faasjs/blob/1705fd2/packages/logger/src/index.ts#L33)

___

### label

• `Optional` **label**: `string`

#### Defined in

[index.ts:34](https://github.com/faasjs/faasjs/blob/1705fd2/packages/logger/src/index.ts#L34)

___

### level

• **level**: `number`

#### Defined in

[index.ts:32](https://github.com/faasjs/faasjs/blob/1705fd2/packages/logger/src/index.ts#L32)

___

### silent

• **silent**: `boolean`

#### Defined in

[index.ts:31](https://github.com/faasjs/faasjs/blob/1705fd2/packages/logger/src/index.ts#L31)

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

#### Defined in

[index.ts:36](https://github.com/faasjs/faasjs/blob/1705fd2/packages/logger/src/index.ts#L36)

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

#### Defined in

[index.ts:35](https://github.com/faasjs/faasjs/blob/1705fd2/packages/logger/src/index.ts#L35)

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

#### Defined in

[index.ts:166](https://github.com/faasjs/faasjs/blob/1705fd2/packages/logger/src/index.ts#L166)

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

#### Defined in

[index.ts:67](https://github.com/faasjs/faasjs/blob/1705fd2/packages/logger/src/index.ts#L67)

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

#### Defined in

[index.ts:97](https://github.com/faasjs/faasjs/blob/1705fd2/packages/logger/src/index.ts#L97)

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

#### Defined in

[index.ts:77](https://github.com/faasjs/faasjs/blob/1705fd2/packages/logger/src/index.ts#L77)

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

#### Defined in

[index.ts:153](https://github.com/faasjs/faasjs/blob/1705fd2/packages/logger/src/index.ts#L153)

___

### time

▸ **time**(`key`, `level?`): [`Logger`](Logger.md)

设置一个计时器

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | `string` | `undefined` | 计时器标识 |
| `level` | [`Level`](../modules.md#level) | `'debug'` | 日志级别，支持 debug、info、warn、error |

#### Returns

[`Logger`](Logger.md)

#### Defined in

[index.ts:116](https://github.com/faasjs/faasjs/blob/1705fd2/packages/logger/src/index.ts#L116)

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

#### Defined in

[index.ts:131](https://github.com/faasjs/faasjs/blob/1705fd2/packages/logger/src/index.ts#L131)

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

#### Defined in

[index.ts:87](https://github.com/faasjs/faasjs/blob/1705fd2/packages/logger/src/index.ts#L87)
