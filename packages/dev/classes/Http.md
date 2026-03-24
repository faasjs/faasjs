[@faasjs/dev](../README.md) / Http

# Class: Http\<TParams, TCookie, TSession\>

## Type Parameters

### TParams

`TParams` _extends_ `Record`\<`string`, `any`\> = `any`

### TCookie

`TCookie` _extends_ `Record`\<`string`, `string`\> = `any`

### TSession

`TSession` _extends_ `Record`\<`string`, `string`\> = `any`

## Implements

- [`Plugin`](../type-aliases/Plugin.md)

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

[`InvokeData`](../type-aliases/InvokeData.md)

##### next

[`Next`](../type-aliases/Next.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onInvoke`

### onMount()

> **onMount**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

##### data

[`MountData`](../type-aliases/MountData.md)

##### next

[`Next`](../type-aliases/Next.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onMount`

### setBody()

> **setBody**(`body`): `Http`\<`TParams`, `TCookie`, `TSession`\>

Set the response body.

#### Parameters

##### body

`string`

Response body content.

#### Returns

`Http`\<`TParams`, `TCookie`, `TSession`\>

### setContentType()

> **setContentType**(`type`, `charset?`): `Http`\<`TParams`, `TCookie`, `TSession`\>

Set the `Content-Type` response header.

#### Parameters

##### type

`string`

Content type alias or full MIME type.

##### charset?

`string` = `'utf-8'`

Charset appended to the header value.

#### Returns

`Http`\<`TParams`, `TCookie`, `TSession`\>

### setHeader()

> **setHeader**(`key`, `value`): `Http`\<`TParams`, `TCookie`, `TSession`\>

Set a response header.

#### Parameters

##### key

`string`

Header name.

##### value

`string`

Header value.

#### Returns

`Http`\<`TParams`, `TCookie`, `TSession`\>

### setStatusCode()

> **setStatusCode**(`code`): `Http`\<`TParams`, `TCookie`, `TSession`\>

Set the HTTP status code for the response.

#### Parameters

##### code

`number`

HTTP status code.

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
