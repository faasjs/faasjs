[@faasjs/dev](../README.md) / HttpError

# Class: HttpError

Error type that carries an HTTP status code for JSON error responses.

## Example

```ts
import { HttpError, defineApi } from '@faasjs/core'

export const func = defineApi({
  async handler() {
    throw new HttpError({
      statusCode: 403,
      message: 'Forbidden',
    })
  },
})
```

## Extends

- `Error`

## Constructors

### Constructor

> **new HttpError**(`options`): `HttpError`

Create an HTTP error with a status code and user-facing message.

#### Parameters

##### options

Error details.

###### message

`string`

User-facing error message serialized in the response body.

###### statusCode?

`number`

HTTP status code returned to the client. Defaults to `500`.

#### Returns

`HttpError`

#### Overrides

`Error.constructor`

## Properties

### message

> `readonly` **message**: `string`

Error message exposed to callers.

#### Overrides

`Error.message`

---

### statusCode

> `readonly` **statusCode**: `number`

HTTP status code returned to the client.
