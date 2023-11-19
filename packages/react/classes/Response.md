# Class: Response\<T\>

Response class

Example:
```ts
new Response({
  status: 200,
  data: {
    name: 'FaasJS'
  }
})
```

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

## Table of contents

### Constructors

- [constructor](Response.md#constructor)

### Properties

- [body](Response.md#body)
- [data](Response.md#data)
- [headers](Response.md#headers)
- [status](Response.md#status)

## Constructors

### constructor

• **new Response**\<`T`\>(`props`): [`Response`](Response.md)\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `Object` |
| `props.body?` | `any` |
| `props.data?` | `T` |
| `props.headers?` | [`ResponseHeaders`](../#responseheaders) |
| `props.status?` | `number` |

#### Returns

[`Response`](Response.md)\<`T`\>

## Properties

### body

• `Readonly` **body**: `any`

___

### data

• `Readonly` **data**: `T`

___

### headers

• `Readonly` **headers**: [`ResponseHeaders`](../#responseheaders)

___

### status

• `Readonly` **status**: `number`
