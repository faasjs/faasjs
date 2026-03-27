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
