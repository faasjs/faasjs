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

> **action**\<`Path`\>(`action`, `params`, `options?`): `Promise`\<[`Response`](Response.md)\<`FaasData`\<`Path`\>\>\>

Makes a request to a FaasJS function.

#### Type Parameters

##### Path

`Path` _extends_ `FaasActionPaths`

#### Parameters

##### action

`Path`

##### params

`FaasParams`\<`Path`\>

##### options?

[`Options`](../type-aliases/Options.md)

#### Returns

`Promise`\<[`Response`](Response.md)\<`FaasData`\<`Path`\>\>\>

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
