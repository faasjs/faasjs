[@faasjs/core](../README.md) / parseFuncFilenameFromStack

# Function: parseFuncFilenameFromStack()

> **parseFuncFilenameFromStack**(`stack?`): `string` \| `undefined`

Extract a `.func.ts` file path from a captured stack trace.

## Parameters

### stack?

`string`

Stack trace text to inspect.

## Returns

`string` \| `undefined`

Absolute or file URL converted source path when found.
