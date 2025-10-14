[@faasjs/react](../README.md) / Response

# Interface: Response\<T\>

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

## Properties

### body

> `readonly` **body**: `any`

### data?

> `readonly` `optional` **data**: `T`

### headers

> `readonly` **headers**: [`ResponseHeaders`](../type-aliases/ResponseHeaders.md)

### status

> `readonly` **status**: `number`
