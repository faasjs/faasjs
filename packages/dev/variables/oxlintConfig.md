[@faasjs/dev](../README.md) / OxlintConfig

# Variable: OxlintConfig

> `const` **OxlintConfig**: `NonNullable`\<`UserConfig`\[`"lint"`\]\>

Shared Oxlint configuration used by FaasJS projects.

## Example

```ts
import { defineConfig } from 'vite-plus'
import { OxlintConfig } from '@faasjs/dev'

export default defineConfig({
  lint: OxlintConfig,
})
```
