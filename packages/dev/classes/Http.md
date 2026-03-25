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

## Properties

### config

> **config**: [`HttpConfig`](../type-aliases/HttpConfig.md)

### name

> `readonly` **name**: `string` = `Name`

#### Implementation of

`Plugin.name`

### type

> `readonly` **type**: `"http"` = `'http'`

#### Implementation of

`Plugin.type`
