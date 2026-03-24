[@faasjs/node-utils](../README.md) / formatLogger

# Function: formatLogger()

> **formatLogger**(`fmt`, ...`args`): `string`

Formats the provided arguments into a string, filtering out any objects
with a `__hidden__` property set to `true`. If formatting fails, it attempts
to stringify each argument individually.

## Parameters

### fmt

`any`

Format string or first value to log.

### args

...`any`[]

Additional values passed to the formatter.

## Returns

`string`

Formatted log message.
