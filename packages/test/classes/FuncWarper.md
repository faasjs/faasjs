# Class: FuncWarper

Test Wrapper for a func

```ts
import { FuncWarper } from '@faasjs/test'

const func = new FuncWarper(__dirname + '/../demo.func.ts')

expect(await func.handler()).toEqual('Hello, world')
```

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

• **new FuncWarper**(`initBy`): [`FuncWarper`](FuncWarper.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `initBy` | [`Func`](Func.md)\<`any`, `any`, `any`\> |

#### Returns

[`FuncWarper`](FuncWarper.md)

• **new FuncWarper**(`initBy`): [`FuncWarper`](FuncWarper.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `initBy` | `string` |

#### Returns

[`FuncWarper`](FuncWarper.md)

## Properties

### config

• `Readonly` **config**: [`Config`](../#config)

___

### file

• `Readonly` **file**: `string`

___

### func

• `Readonly` **func**: [`Func`](Func.md)\<`any`, `any`, `any`\>

___

### logger

• `Readonly` **logger**: `Logger`

___

### plugins

• `Readonly` **plugins**: [`Plugin`](../#plugin)[]

___

### staging

• `Readonly` **staging**: `string`

## Methods

### JSONhandler

▸ **JSONhandler**\<`TData`\>(`body?`, `options?`): `Promise`\<\{ `body`: `any` ; `cookie?`: `Record`\<`string`, `any`\> ; `data?`: `TData` ; `error?`: \{ `message`: `string`  } ; `headers`: \{ `[key: string]`: `string`;  } ; `session?`: `Record`\<`string`, `any`\> ; `statusCode`: `number`  }\>

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

`Promise`\<\{ `body`: `any` ; `cookie?`: `Record`\<`string`, `any`\> ; `data?`: `TData` ; `error?`: \{ `message`: `string`  } ; `headers`: \{ `[key: string]`: `string`;  } ; `session?`: `Record`\<`string`, `any`\> ; `statusCode`: `number`  }\>

___

### handler

▸ **handler**\<`TResult`\>(`event?`, `context?`): `Promise`\<`TResult`\>

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

`Promise`\<`TResult`\>

___

### mount

▸ **mount**(`handler?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `handler?` | (`func`: [`FuncWarper`](FuncWarper.md)) => `void` \| `Promise`\<`void`\> |

#### Returns

`Promise`\<`void`\>
