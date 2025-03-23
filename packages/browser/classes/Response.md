[@faasjs/browser](../README.md) / Response

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

### T

`T` = `any`

## Constructors

### new Response()

> **new Response**\<`T`\>(`props`): `Response`\<`T`\>

#### Parameters

##### props

[`ResponseProps`](../type-aliases/ResponseProps.md)\<`T`\> = `{}`

#### Returns

`Response`\<`T`\>

## Properties

### body

> `readonly` **body**: `any`

### data?

> `readonly` `optional` **data**: `T`

### headers

> `readonly` **headers**: [`ResponseHeaders`](../type-aliases/ResponseHeaders.md)

### status

> `readonly` **status**: `number`
