[@faasjs/browser](../README.md) / FaasBrowserClient

# Class: FaasBrowserClient

FaasJS browser client

```ts
const client = new FaasBrowserClient('http://localhost:8080')

await client.action('func', { key: 'value' })
```

## Constructors

### new FaasBrowserClient(baseUrl, options)

> **new FaasBrowserClient**(`baseUrl`, `options`?): [`FaasBrowserClient`](FaasBrowserClient.md)

#### Parameters

• **baseUrl**: `string`

• **options?**: [`Options`](../type-aliases/Options.md)

#### Returns

[`FaasBrowserClient`](FaasBrowserClient.md)

## Properties

### defaultOptions

> **defaultOptions**: [`Options`](../type-aliases/Options.md)

### host

> **host**: `string`

### id

> **`readonly`** **id**: `string`

## Methods

### action()

> **action**\<`PathOrData`\>(`action`, `params`?, `options`?): `Promise`\<[`Response`](Response.md)\<`FaasData`\<`PathOrData`\>\>\>

Request a FaasJS function

#### Type parameters

• **PathOrData** extends `FaasAction`

#### Parameters

• **action**: `string` \| `PathOrData`

function path

• **params?**: `FaasParams`\<`PathOrData`\>

function params

• **options?**: [`Options`](../type-aliases/Options.md)

request options
```ts
await client.action('func', { key: 'value' })
```

#### Returns

`Promise`\<[`Response`](Response.md)\<`FaasData`\<`PathOrData`\>\>\>
