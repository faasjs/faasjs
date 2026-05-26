[@faasjs/node-utils](../README.md) / formatSchemaError

# Function: formatSchemaError()

> **formatSchemaError**(`error`, `message`): `string`

Format a Zod validation error with FaasJS' boundary-validation message style.

## Parameters

### error

`ZodError`

Zod validation error to format.

### message

`string`

First line of the formatted message.

## Returns

`string`

Multi-line formatted validation message.
