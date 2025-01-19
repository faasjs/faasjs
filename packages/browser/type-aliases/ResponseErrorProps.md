[@faasjs/browser](../README.md) / ResponseErrorProps

# Type Alias: ResponseErrorProps

> **ResponseErrorProps**: `object`

## Type declaration

### body?

> `optional` **body**: `any`

#### Default

```ts
{ error: Error(message) }
```

### headers?

> `optional` **headers**: [`ResponseHeaders`](ResponseHeaders.md)

#### Default

```ts
{}
```

### message

> **message**: `string`

### originalError?

> `optional` **originalError**: `Error`

### status?

> `optional` **status**: `number`

#### Default

```ts
500
```
