[@faasjs/dev](../README.md) / isTypegenInputFile

# Function: isTypegenInputFile()

> **isTypegenInputFile**(`filePath`): `boolean`

Determine whether a file change should trigger Faas type generation.

## Parameters

### filePath

`string`

Absolute or relative path reported by a file watcher.

## Returns

`boolean`

`true` when the changed file can affect generated route declarations.

## Example

```ts
import { isTypegenInputFile } from '@faasjs/dev'

isTypegenInputFile('src/orders/create.api.ts') // true
isTypegenInputFile('src/orders/service.ts') // false
```
