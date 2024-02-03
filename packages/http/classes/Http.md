[@faasjs/http](../README.md) / Http

# Class: Http\<TParams, TCookie, TSession\>

## Type parameters

• **TParams** extends `Record`\<`string`, `any`\> = `any`

• **TCookie** extends `Record`\<`string`, `string`\> = `any`

• **TSession** extends `Record`\<`string`, `string`\> = `any`

## Implements

- `Plugin`

## Constructors

### new Http(config)

> **new Http**\<`TParams`, `TCookie`, `TSession`\>(`config`?): [`Http`](Http.md)\<`TParams`, `TCookie`, `TSession`\>

#### Parameters

• **config?**: [`HttpConfig`](../type-aliases/HttpConfig.md)\<`TParams`, `TCookie`, `TSession`\>

#### Returns

[`Http`](Http.md)\<`TParams`, `TCookie`, `TSession`\>

## Properties

### body

> **body**: `any`

### config

> **config**: [`HttpConfig`](../type-aliases/HttpConfig.md)\<`TParams`, `TCookie`, `TSession`\>

### cookie

> **cookie**: [`Cookie`](Cookie.md)\<`TCookie`, `TSession`\>

### headers

> **headers**: `Object`

#### Index signature

 \[`key`: `string`\]: `string`

### name

> **`readonly`** **name**: `string` = `Name`

#### Implementation of

`Plugin.name`

### params

> **params**: `TParams`

### session

> **session**: [`Session`](Session.md)\<`TSession`, `TCookie`\>

### type

> **`readonly`** **type**: `string` = `Name`

#### Implementation of

`Plugin.type`

## Methods

### onDeploy()

> **onDeploy**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

• **data**: `DeployData`

• **next**: `Next`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onDeploy`

### onInvoke()

> **onInvoke**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

• **data**: `InvokeData`

• **next**: `Next`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onInvoke`

### onMount()

> **onMount**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

• **data**: `MountData`

• **next**: `Next`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onMount`

### setBody()

> **setBody**(`body`): [`Http`](Http.md)\<`TParams`, `TCookie`, `TSession`\>

set body

#### Parameters

• **body**: `string`

\{*\} 内容

#### Returns

[`Http`](Http.md)\<`TParams`, `TCookie`, `TSession`\>

### setContentType()

> **setContentType**(`type`, `charset`): [`Http`](Http.md)\<`TParams`, `TCookie`, `TSession`\>

set Content-Type

#### Parameters

• **type**: `string`

\{string\} 类型

• **charset**: `string`= `'utf-8'`

\{string\} 编码

#### Returns

[`Http`](Http.md)\<`TParams`, `TCookie`, `TSession`\>

### setHeader()

> **setHeader**(`key`, `value`): [`Http`](Http.md)\<`TParams`, `TCookie`, `TSession`\>

set header

#### Parameters

• **key**: `string`

\{string\} key

• **value**: `string`

\{string\} value

#### Returns

[`Http`](Http.md)\<`TParams`, `TCookie`, `TSession`\>

### setStatusCode()

> **setStatusCode**(`code`): [`Http`](Http.md)\<`TParams`, `TCookie`, `TSession`\>

set status code

#### Parameters

• **code**: `number`

\{number\} 状态码

#### Returns

[`Http`](Http.md)\<`TParams`, `TCookie`, `TSession`\>
