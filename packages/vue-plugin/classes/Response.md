[@faasjs/vue-plugin](../README.md) / Response

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

• **T** = `any`

## Constructors

### new Response(props)

> **new Response**\<`T`\>(`props`): [`Response`](Response.md)\<`T`\>

#### Parameters

• **props**

• **props\.body?**: `any`

• **props\.data?**: `T`

• **props\.headers?**: [`ResponseHeaders`](../type-aliases/ResponseHeaders.md)

• **props\.status?**: `number`

#### Returns

[`Response`](Response.md)\<`T`\>

## Properties

### body

> **`readonly`** **body**: `any`

### data

> **`readonly`** **data**: `T`

### headers

> **`readonly`** **headers**: [`ResponseHeaders`](../type-aliases/ResponseHeaders.md)

### status

> **`readonly`** **status**: `number`
