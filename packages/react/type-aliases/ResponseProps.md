[@faasjs/react](../README.md) / ResponseProps

# Type Alias: ResponseProps\<T\>

> **ResponseProps**\<`T`\> = `object`

Properties for creating a Response object.

Defines the structure of response data that can be passed to the Response constructor
or returned from mock handlers.

## Remarks

- All properties are optional
- At least one of data or body should be provided for meaningful responses
- The Response class automatically defaults status to 200 or 204 based on content
- If data is provided without body, body is automatically JSON.stringify(data)
- Used by Response constructor and mock handlers

## See

 - Response for the class that uses these properties
 - ResponseErrorProps for error response properties

## Type Parameters

### T

`T` = `any`

The type of the data property for type-safe response creation

## Properties

### body?

> `optional` **body**: `any`

The raw response body as a string or object.
  Optional: if not provided, body is automatically populated from data using JSON.stringify.

### data?

> `optional` **data**: `T`

The parsed JSON data to include in the response.
  Optional: contains the response payload when JSON data is provided.

### headers?

> `optional` **headers**: [`ResponseHeaders`](ResponseHeaders.md)

The response headers as a key-value object.
  Optional: defaults to an empty object if not provided.

### status?

> `optional` **status**: `number`

The HTTP status code for the response.
  Optional: defaults to 200 if data or body is provided, 204 otherwise.
