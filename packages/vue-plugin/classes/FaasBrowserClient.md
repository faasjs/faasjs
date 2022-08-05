# Class: FaasBrowserClient

FaasJS browser client

Example:

```ts
new FaasBrowserClient({
  baseURL: 'http://localhost:8080'
})
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

Create FaasJS Client

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseUrl` | `string` |  |
| `options?` | [`Options`](../#options) | default options |

## Properties

### defaultOptions

• **defaultOptions**: [`Options`](../#options)

___

### host

• **host**: `string`

## Methods

### action

▸ **action**<`PathOrData`\>(`action`, `params?`, `options?`): `Promise`<[`Response`](Response.md)<`FaasData`<`PathOrData`\>\>\>

Request a FaasJS function

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `Record`<`string`, `any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `action` | `string` \| `PathOrData` | function path |
| `params?` | `FaasParams`<`PathOrData`\> | function params |
| `options?` | [`Options`](../#options) | request options |

#### Returns

`Promise`<[`Response`](Response.md)<`FaasData`<`PathOrData`\>\>\>
