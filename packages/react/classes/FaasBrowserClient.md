[@faasjs/react](../README.md) / FaasBrowserClient

# Class: FaasBrowserClient

Browser client for FaasJS - provides HTTP client functionality for making API requests from web applications.

## Constructors

### Constructor

> **new FaasBrowserClient**(`baseUrl?`, `options?`): `FaasBrowserClient`

Creates a new FaasBrowserClient instance.

#### Parameters

##### baseUrl?

`` `${string}/` `` = `'/'`

##### options?

[`Options`](../type-aliases/Options.md) = `...`

#### Returns

`FaasBrowserClient`

## Methods

### action()

> **action**\<`PathOrData`\>(`action`, `params?`, `options?`): `Promise`\<[`Response`](Response.md)\<[`FaasData`](../type-aliases/FaasData.md)\<`PathOrData`\>\>\>

Makes a request to a FaasJS function.

#### Type Parameters

##### PathOrData

`PathOrData` *extends* [`FaasActionUnionType`](../type-aliases/FaasActionUnionType.md)

#### Parameters

##### action

[`FaasAction`](../type-aliases/FaasAction.md)\<`PathOrData`\>

##### params?

[`FaasParams`](../type-aliases/FaasParams.md)\<`PathOrData`\>

##### options?

[`Options`](../type-aliases/Options.md)

#### Returns

`Promise`\<[`Response`](Response.md)\<[`FaasData`](../type-aliases/FaasData.md)\<`PathOrData`\>\>\>

## Properties

### baseUrl

> **baseUrl**: `` `${string}/` ``

Base URL used to build action request URLs.

### defaultOptions

> **defaultOptions**: [`Options`](../type-aliases/Options.md)

Default request options merged into every request.

### id

> `readonly` **id**: `string`

Unique identifier for this client instance.
