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
- [id](FaasBrowserClient.md#id)

### Methods

- [action](FaasBrowserClient.md#action)

## Constructors

### constructor

• **new FaasBrowserClient**(`baseUrl`, `options?`): [`FaasBrowserClient`](FaasBrowserClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseUrl` | `string` |
| `options?` | [`Options`](../#options) |

#### Returns

[`FaasBrowserClient`](FaasBrowserClient.md)

## Properties

### defaultOptions

• **defaultOptions**: [`Options`](../#options)

___

### host

• **host**: `string`

___

### id

• `Readonly` **id**: `string`

## Methods

### action

▸ **action**\<`PathOrData`\>(`action`, `params?`, `options?`): `Promise`\<[`Response`](Response.md)\<`FaasData`\<`PathOrData`\>\>\>

Request a FaasJS function

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `FaasAction` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `action` | `string` \| `PathOrData` | function path |
| `params?` | `FaasParams`\<`PathOrData`\> | function params |
| `options?` | [`Options`](../#options) | request options ```ts await client.action('func', { key: 'value' }) ``` |

#### Returns

`Promise`\<[`Response`](Response.md)\<`FaasData`\<`PathOrData`\>\>\>
