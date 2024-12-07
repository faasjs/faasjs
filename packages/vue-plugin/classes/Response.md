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

## Type Parameters

• **T** = `any`

## Constructors

### new Response()

> **new Response**\<`T`\>(`props`): [`Response`](Response.md)\<`T`\>

#### Parameters

##### props

`ResponseProps`\<`T`\> = `{}`

#### Returns

[`Response`](Response.md)\<`T`\>

## Properties

### body

> `readonly` **body**: `any`

### data

> `readonly` **data**: `T`

### headers

> `readonly` **headers**: [`ResponseHeaders`](../type-aliases/ResponseHeaders.md)

### status

> `readonly` **status**: `number`
