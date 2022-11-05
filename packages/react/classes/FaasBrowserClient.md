# Class: FaasBrowserClient

FaasJS browser client

```ts
const client = new FaasBrowserClient('http://localhost:8080')

await client.action('func', { key: 'value' })
```

## Table of contents

### Constructors

- [constructor](FaasBrowserClient.md#constructor)

### Properties

- [defaultOptions](FaasBrowserClient.md#defaultoptions)
- [host](FaasBrowserClient.md#host)

### Methods

- [action](FaasBrowserClient.md#action)

## Constructors

### constructor

• **new FaasBrowserClient**(`baseUrl`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseUrl` | `string` |
| `options?` | [`Options`](../#options) |

## Properties

### defaultOptions

• **defaultOptions**: [`Options`](../#options)

___

### host

• **host**: `string`

## Methods

### action

▸ **action**<`PathOrData`\>(`action`, `params?`, `options?`): `Promise`<[`Response`](Response.md)<[`FaasData`](../#faasdata)<`PathOrData`\>\>\>

Request a FaasJS function

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `Record`<`string`, `any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `action` | `string` \| `PathOrData` | function path |
| `params?` | [`FaasParams`](../#faasparams)<`PathOrData`\> | function params |
| `options?` | [`Options`](../#options) | request options ```ts await client.action('func', { key: 'value' }) ``` |

#### Returns

`Promise`<[`Response`](Response.md)<[`FaasData`](../#faasdata)<`PathOrData`\>\>\>
