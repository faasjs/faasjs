[@faasjs/dev](../README.md) / isTypegenSourceFile

# Function: isTypegenSourceFile()

> **isTypegenSourceFile**(`filePath`): `boolean`

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
import { isTypegenSourceFile } from '@faasjs/dev'

isTypegenSourceFile('src/orders/create.func.ts') // true
isTypegenSourceFile('src/orders/service.ts') // false
```
