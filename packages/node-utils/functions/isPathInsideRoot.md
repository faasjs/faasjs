[@faasjs/node-utils](../README.md) / isPathInsideRoot

# Function: isPathInsideRoot()

> **isPathInsideRoot**(`path`, `root`): `boolean`

Check whether a filesystem path stays within a root directory after normalization.

Existing paths are resolved through `realpath` so symlink escapes are rejected, while
missing paths still fall back to their resolved absolute location for containment checks.

## Parameters

### path

`string`

Target path to validate.

### root

`string`

Root directory that must contain the target path.

## Returns

`boolean`

`true` when the target stays inside `root`, otherwise `false`.

## Example

```ts
import { isPathInsideRoot } from '@faasjs/node-utils'

isPathInsideRoot('/project/public/index.html', '/project/public')
```
