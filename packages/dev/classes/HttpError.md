[@faasjs/dev](../README.md) / HttpError

# Class: HttpError

Error type that carries an HTTP status code for JSON error responses.

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

###### statusCode?

`number`

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

### statusCode

> `readonly` **statusCode**: `number`

HTTP status code returned to the client.
