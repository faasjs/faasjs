[@faasjs/dev](../README.md) / isTypegenInputFile

# Function: isTypegenInputFile()

> **isTypegenInputFile**(`filePath`): `boolean`

Determine whether a file change should trigger Faas type generation.

API files affect route declarations directly. `faas.yaml` and `faas.yml` files
can affect the resolved server root, so watchers should treat them as typegen
inputs as well.

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
