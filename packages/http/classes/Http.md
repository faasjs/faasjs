# Class: Http<TParams, TCookie, TSession\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends `Record`<`string`, `any`\> = `any` |
| `TCookie` | extends `Record`<`string`, `string`\> = `any` |
| `TSession` | extends `Record`<`string`, `string`\> = `any` |

## Implements

- `Plugin`

## Table of contents

### Constructors

- [constructor](Http.md#constructor)

### Properties

- [body](Http.md#body)
- [config](Http.md#config)
- [cookie](Http.md#cookie)
- [headers](Http.md#headers)
- [name](Http.md#name)
- [params](Http.md#params)
- [session](Http.md#session)
- [type](Http.md#type)

### Methods

- [onDeploy](Http.md#ondeploy)
- [onInvoke](Http.md#oninvoke)
- [onMount](Http.md#onmount)
- [setBody](Http.md#setbody)
- [setContentType](Http.md#setcontenttype)
- [setHeader](Http.md#setheader)
- [setStatusCode](Http.md#setstatuscode)

## Constructors

### constructor

• **new Http**<`TParams`, `TCookie`, `TSession`\>(`config?`)

创建 Http 插件实例

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends `Record`<`string`, `any`\> = `any` |
| `TCookie` | extends `Record`<`string`, `string`\> = `any` |
| `TSession` | extends `Record`<`string`, `string`\> = `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | [`HttpConfig`](../modules.md#httpconfig)<`TParams`, `TCookie`, `TSession`\> | 配置项 |

#### Defined in

[index.ts:129](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L129)

## Properties

### body

• **body**: `any`

#### Defined in

[index.ts:94](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L94)

___

### config

• **config**: [`HttpConfig`](../modules.md#httpconfig)<`TParams`, `TCookie`, `TSession`\>

#### Defined in

[index.ts:99](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L99)

___

### cookie

• **cookie**: [`Cookie`](Cookie.md)<`TCookie`, `TSession`\>

#### Defined in

[index.ts:97](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L97)

___

### headers

• **headers**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[index.ts:91](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L91)

___

### name

• `Readonly` **name**: `string` = `Name`

#### Implementation of

Plugin.name

#### Defined in

[index.ts:89](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L89)

___

### params

• **params**: `TParams`

#### Defined in

[index.ts:96](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L96)

___

### session

• **session**: [`Session`](Session.md)<`TSession`, `TCookie`\>

#### Defined in

[index.ts:98](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L98)

___

### type

• `Readonly` **type**: `string` = `Name`

#### Implementation of

Plugin.type

#### Defined in

[index.ts:88](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L88)

## Methods

### onDeploy

▸ **onDeploy**(`data`, `next`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `DeployData` |
| `next` | `Next` |

#### Returns

`Promise`<`void`\>

#### Implementation of

Plugin.onDeploy

#### Defined in

[index.ts:140](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L140)

___

### onInvoke

▸ **onInvoke**(`data`, `next`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `InvokeData`<`any`, `any`, `any`\> |
| `next` | `Next` |

#### Returns

`Promise`<`void`\>

#### Implementation of

Plugin.onInvoke

#### Defined in

[index.ts:190](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L190)

___

### onMount

▸ **onMount**(`data`, `next`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `MountData` |
| `next` | `Next` |

#### Returns

`Promise`<`void`\>

#### Implementation of

Plugin.onMount

#### Defined in

[index.ts:173](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L173)

___

### setBody

▸ **setBody**(`body`): [`Http`](Http.md)<`TParams`, `TCookie`, `TSession`\>

设置 body

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `body` | `string` | 内容 |

#### Returns

[`Http`](Http.md)<`TParams`, `TCookie`, `TSession`\>

#### Defined in

[index.ts:347](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L347)

___

### setContentType

▸ **setContentType**(`type`, `charset?`): [`Http`](Http.md)<`TParams`, `TCookie`, `TSession`\>

设置 Content-Type

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `type` | `string` | `undefined` | 类型 |
| `charset` | `string` | `'utf-8'` | 编码 |

#### Returns

[`Http`](Http.md)<`TParams`, `TCookie`, `TSession`\>

#### Defined in

[index.ts:329](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L329)

___

### setHeader

▸ **setHeader**(`key`, `value`): [`Http`](Http.md)<`TParams`, `TCookie`, `TSession`\>

设置 header

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | key |
| `value` | `string` | value |

#### Returns

[`Http`](Http.md)<`TParams`, `TCookie`, `TSession`\>

#### Defined in

[index.ts:319](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L319)

___

### setStatusCode

▸ **setStatusCode**(`code`): [`Http`](Http.md)<`TParams`, `TCookie`, `TSession`\>

设置状态码

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `number` | 状态码 |

#### Returns

[`Http`](Http.md)<`TParams`, `TCookie`, `TSession`\>

#### Defined in

[index.ts:338](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L338)
