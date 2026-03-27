[@faasjs/dev](../README.md) / isTypegenSourceFile

# Function: isTypegenSourceFile()

> **isTypegenSourceFile**(`filePath`): `boolean`

Determine whether a file change should trigger Faas type generation.

## Parameters

### filePath

`string`

Absolute or relative file path.

## Returns

`boolean`

`true` for `.func.ts` files and `faas.yaml` updates.

## Example

```ts
import { isTypegenSourceFile } from '@faasjs/dev'

isTypegenSourceFile('src/orders/create.func.ts') // true
isTypegenSourceFile('src/orders/service.ts') // false
```
