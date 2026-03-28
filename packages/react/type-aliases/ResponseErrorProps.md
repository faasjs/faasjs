[@faasjs/react](../README.md) / ResponseErrorProps

# Type Alias: ResponseErrorProps

> **ResponseErrorProps** = `object`

Input accepted by the [ResponseError](../classes/ResponseError.md) constructor.

## Properties

### body?

> `optional` **body?**: `any`

Raw error body or structured error payload.

#### Default

```ts
{
  error: {
    message
  }
}
```

### headers?

> `optional` **headers?**: [`ResponseHeaders`](ResponseHeaders.md)

Response headers returned with the error.

#### Default

```ts
{
}
```

### message

> **message**: `string`

User-facing error message.

### originalError?

> `optional` **originalError?**: `Error`

Original error preserved when this instance wraps another exception.

### status?

> `optional` **status?**: `number`

HTTP status code reported for the error.

#### Default

```ts
500
```
