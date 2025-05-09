[@faasjs/http](../README.md) / Http

# Class: Http\<TParams, TCookie, TSession\>

## Type Parameters

### TParams

`TParams` *extends* `Record`\<`string`, `any`\> = `any`

### TCookie

`TCookie` *extends* `Record`\<`string`, `string`\> = `any`

### TSession

`TSession` *extends* `Record`\<`string`, `string`\> = `any`

## Implements

- `Plugin`

## Constructors

### Constructor

> **new Http**\<`TParams`, `TCookie`, `TSession`\>(`config?`): `Http`\<`TParams`, `TCookie`, `TSession`\>

#### Parameters

##### config?

[`HttpConfig`](../type-aliases/HttpConfig.md)

#### Returns

`Http`\<`TParams`, `TCookie`, `TSession`\>

## Methods

### onInvoke()

> **onInvoke**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

##### data

`InvokeData`

##### next

`Next`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onInvoke`

### onMount()

> **onMount**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

##### data

`MountData`

##### next

`Next`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onMount`

### setBody()

> **setBody**(`body`): `Http`\<`TParams`, `TCookie`, `TSession`\>

set body

#### Parameters

##### body

`string`

{*} 内容

#### Returns

`Http`\<`TParams`, `TCookie`, `TSession`\>

### setContentType()

> **setContentType**(`type`, `charset`): `Http`\<`TParams`, `TCookie`, `TSession`\>

set Content-Type

#### Parameters

##### type

`string`

{string} 类型

##### charset

`string` = `'utf-8'`

{string} 编码

#### Returns

`Http`\<`TParams`, `TCookie`, `TSession`\>

### setHeader()

> **setHeader**(`key`, `value`): `Http`\<`TParams`, `TCookie`, `TSession`\>

set header

#### Parameters

##### key

`string`

{string} key

##### value

`string`

{string} value

#### Returns

`Http`\<`TParams`, `TCookie`, `TSession`\>

### setStatusCode()

> **setStatusCode**(`code`): `Http`\<`TParams`, `TCookie`, `TSession`\>

set status code

#### Parameters

##### code

`number`

{number} 状态码

#### Returns

`Http`\<`TParams`, `TCookie`, `TSession`\>

## Properties

### body

> **body**: `any`

### config

> **config**: [`HttpConfig`](../type-aliases/HttpConfig.md)

### cookie

> **cookie**: [`Cookie`](Cookie.md)\<`TCookie`, `TSession`\>

### headers

> **headers**: `object`

#### Index Signature

\[`key`: `string`\]: `string`

### name

> `readonly` **name**: `string` = `Name`

#### Implementation of

`Plugin.name`

### params

> **params**: `TParams`

### session

> **session**: [`Session`](Session.md)\<`TSession`, `TCookie`\>

### type

> `readonly` **type**: `"http"` = `'http'`

#### Implementation of

`Plugin.type`
