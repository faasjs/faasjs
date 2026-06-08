[@faasjs/pg](../README.md) / createTemplateStringsArray

# Function: createTemplateStringsArray()

> **createTemplateStringsArray**(`str`): `TemplateStringsArray`

Normalizes a SQL string or template input into a `TemplateStringsArray`.

String input is split on `?`, so each `?` becomes a `postgres.js` parameter gap.
Template-literal input is returned unchanged.

## Parameters

### str

`string` \| `TemplateStringsArray`

SQL source string or template literal array.

## Returns

`TemplateStringsArray`

Template-strings representation for `postgres.js`.
