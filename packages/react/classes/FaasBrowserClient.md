[@faasjs/react](../README.md) / FaasBrowserClient

# Class: FaasBrowserClient

Browser client for FaasJS - provides HTTP client functionality for making API requests from web applications.

Handles request URL construction, default and per-request option merging,
before-request hooks, mock resolution for testing, and native fetch dispatching.

## Example

```ts
import { FaasBrowserClient } from '@faasjs/react'

const client = new FaasBrowserClient('https://api.example.com/', {
  headers: { 'X-Custom-Header': 'value' },
})

const response = await client.action('posts/get', { id: 1 })
console.log(response.data)
```

## Constructors

### Constructor

> **new FaasBrowserClient**(`baseUrl?`, `options?`): `FaasBrowserClient`

Creates a new FaasBrowserClient instance.

#### Parameters

##### baseUrl?

`` `${string}/` `` = `'/'`

Base URL used to build action request URLs. Must end with `/`.

##### options?

[`Options`](../type-aliases/Options.md) = `...`

Default request options merged into every request.

#### Returns

`FaasBrowserClient`

#### Throws

When `baseUrl` does not end with a forward slash.

## Methods

### action()

> **action**\<`Path`\>(`action`, `params?`, `options?`): `Promise`\<[`Response`](Response.md)\<`FaasData`\<`Path`\>\>\>

Makes a request to a FaasJS function.

Builds the request URL and resolved options, runs `beforeRequest` hooks,
checks for mock handlers, and dispatches via native `fetch` or custom `request`.
When `stream` is enabled the raw fetch response is returned so callers can
consume the body stream themselves.

#### Type Parameters

##### Path

`Path` _extends_ `FaasActionPaths`

Action path used to infer the request params and response data types.

#### Parameters

##### action

`Path`

Action path to invoke. Must be non-empty.

##### params?

`FaasParams`\<`Path`\>

Params sent to the action. Defaults to an empty object.

##### options?

[`Options`](../type-aliases/Options.md)

Per-request overrides on top of client defaults.

#### Returns

`Promise`\<[`Response`](Response.md)\<`FaasData`\<`Path`\>\>\>

FaasJS response containing the parsed data, or native fetch response when streaming.

#### Throws

When `action` is empty or falsy.

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
