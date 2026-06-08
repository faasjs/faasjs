[@faasjs/node-utils](../README.md) / loadPackage

# Function: loadPackage()

> **loadPackage**\<`T`\>(`name`): `Promise`\<`T`\>

Load a module in the current Node ESM runtime and return its default export.

Local file paths are converted to `file://` URLs, tsconfig-aware hooks are
installed when a project root can be inferred, and project-local file imports
can receive a version query string for cache busting. Bare package specifiers
and URL-scheme specifiers are imported as provided.

The target module must provide a `default` export; named exports are not used
as a fallback.

## Type Parameters

### T

`T` = `unknown`

The type of module to be loaded.

## Parameters

### name

`string`

Package name, file path, or module specifier to load.

## Returns

`Promise`\<`T`\>

Loaded default export value.

## Throws

If the requested module fails to load or the default export is missing.

## Example

```ts
import { loadPackage } from '@faasjs/node-utils'

const api = await loadPackage('./src/hello.api.ts')
```
