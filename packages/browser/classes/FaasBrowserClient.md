[@faasjs/browser](../README.md) / FaasBrowserClient

# Class: FaasBrowserClient

FaasJS browser client

```ts
import { FaasBrowserClient } from '@faasjs/browser'

const client = new FaasBrowserClient('http://localhost:8080/')

await client.action('func', { key: 'value' })
```

## Constructors

### new FaasBrowserClient()

> **new FaasBrowserClient**(`baseUrl`, `options`): `FaasBrowserClient`

#### Parameters

##### baseUrl

`` `${string}/` `` = `'/'`

##### options

[`Options`](../type-aliases/Options.md) = `...`

#### Returns

`FaasBrowserClient`

## Methods

### action()

> **action**\<`PathOrData`\>(`action`, `params`?, `options`?): `Promise`\<[`Response`](Response.md)\<`FaasData`\<`PathOrData`\>\>\>

Request a FaasJS function

#### Type Parameters

##### PathOrData

`PathOrData` *extends* `FaasActionUnionType`

#### Parameters

##### action

`FaasAction`\<`PathOrData`\>

function's path or react's server action

##### params?

`FaasParams`\<`PathOrData`\>

function's params

##### options?

[`Options`](../type-aliases/Options.md)

request options
```ts
await client.action('func', { key: 'value' })
```

#### Returns

`Promise`\<[`Response`](Response.md)\<`FaasData`\<`PathOrData`\>\>\>

## Properties

### baseUrl

> **baseUrl**: `` `${string}/` ``

### defaultOptions

> **defaultOptions**: [`Options`](../type-aliases/Options.md)

### id

> `readonly` **id**: `string`
