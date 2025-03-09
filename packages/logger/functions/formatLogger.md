[@faasjs/logger](../README.md) / formatLogger

# Function: formatLogger()

> **formatLogger**(`fmt`, ...`args`): `string`

Formats the provided arguments into a string, filtering out any objects
with a `__hidden__` property set to `true`. If formatting fails, it attempts
to stringify each argument individually.

## Parameters

### fmt

`any`

### args

...`any`[]

The arguments to format.

## Returns

`string`

The formatted string.
