[@faasjs/core](../README.md) / parseApiFilenameFromStack

# Function: parseApiFilenameFromStack()

> **parseApiFilenameFromStack**(`stack?`): `string` \| `undefined`

Extract a `.api.ts` file path from a captured stack trace.

## Parameters

### stack?

`string`

Stack trace text to inspect.

## Returns

`string` \| `undefined`

Absolute or file URL converted source path when found.

## Example

```ts
import { parseApiFilenameFromStack } from '@faasjs/core'

const filename = parseApiFilenameFromStack('Error\\n    at file:///project/src/demo.api.ts:3:1')
```
