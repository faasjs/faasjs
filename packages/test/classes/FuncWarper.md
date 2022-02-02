# Class: FuncWarper

自动化测试用的云函数实例

## Indexable

▪ [key: `string`]: `any`

## Table of contents

### Constructors

- [constructor](FuncWarper.md#constructor)

### Properties

- [config](FuncWarper.md#config)
- [file](FuncWarper.md#file)
- [func](FuncWarper.md#func)
- [logger](FuncWarper.md#logger)
- [plugins](FuncWarper.md#plugins)
- [staging](FuncWarper.md#staging)

### Methods

- [JSONhandler](FuncWarper.md#jsonhandler)
- [handler](FuncWarper.md#handler)
- [mount](FuncWarper.md#mount)

## Constructors

### constructor

• **new FuncWarper**(`initBy`)

创建测试实例

**`example`** new TestCase(require.resolve('../demo.flow.ts'))

#### Parameters

| Name | Type |
| :------ | :------ |
| `initBy` | [`Func`](Func.md)<`any`, `any`, `any`\> |

#### Defined in

[test/src/index.ts:31](https://github.com/faasjs/faasjs/blob/1705fd2/packages/test/src/index.ts#L31)

• **new FuncWarper**(`initBy`)

创建测试实例

**`example`** new TestCase(require.resolve('../demo.flow.ts'))

#### Parameters

| Name | Type |
| :------ | :------ |
| `initBy` | `string` |

#### Defined in

[test/src/index.ts:32](https://github.com/faasjs/faasjs/blob/1705fd2/packages/test/src/index.ts#L32)

## Properties

### config

• `Readonly` **config**: [`Config`](../modules.md#config)

#### Defined in

[test/src/index.ts:21](https://github.com/faasjs/faasjs/blob/1705fd2/packages/test/src/index.ts#L21)

___

### file

• `Readonly` **file**: `string`

#### Defined in

[test/src/index.ts:17](https://github.com/faasjs/faasjs/blob/1705fd2/packages/test/src/index.ts#L17)

___

### func

• `Readonly` **func**: [`Func`](Func.md)<`any`, `any`, `any`\>

#### Defined in

[test/src/index.ts:20](https://github.com/faasjs/faasjs/blob/1705fd2/packages/test/src/index.ts#L20)

___

### logger

• `Readonly` **logger**: `Logger`

#### Defined in

[test/src/index.ts:19](https://github.com/faasjs/faasjs/blob/1705fd2/packages/test/src/index.ts#L19)

___

### plugins

• `Readonly` **plugins**: [`Plugin`](../modules.md#plugin)[]

#### Defined in

[test/src/index.ts:22](https://github.com/faasjs/faasjs/blob/1705fd2/packages/test/src/index.ts#L22)

___

### staging

• `Readonly` **staging**: `string`

#### Defined in

[test/src/index.ts:18](https://github.com/faasjs/faasjs/blob/1705fd2/packages/test/src/index.ts#L18)

## Methods

### JSONhandler

▸ **JSONhandler**<`TData`\>(`body?`, `options?`): `Promise`<{ `body`: `any` ; `data?`: `TData` ; `error?`: { `message`: `string`  } ; `headers`: { [key: string]: `string`;  } ; `statusCode`: `number`  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TData` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `body?` | `Object` |
| `options` | `Object` |
| `options.cookie?` | `Object` |
| `options.headers?` | `Object` |
| `options.session?` | `Object` |

#### Returns

`Promise`<{ `body`: `any` ; `data?`: `TData` ; `error?`: { `message`: `string`  } ; `headers`: { [key: string]: `string`;  } ; `statusCode`: `number`  }\>

#### Defined in

[test/src/index.ts:90](https://github.com/faasjs/faasjs/blob/1705fd2/packages/test/src/index.ts#L90)

___

### handler

▸ **handler**<`TResult`\>(`event?`, `context?`): `Promise`<`TResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `any` |
| `context` | `any` |

#### Returns

`Promise`<`TResult`\>

#### Defined in

[test/src/index.ts:78](https://github.com/faasjs/faasjs/blob/1705fd2/packages/test/src/index.ts#L78)

___

### mount

▸ **mount**(`handler?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `handler?` | (`func`: [`FuncWarper`](FuncWarper.md)) => `void` \| `Promise`<`void`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[test/src/index.ts:68](https://github.com/faasjs/faasjs/blob/1705fd2/packages/test/src/index.ts#L68)
