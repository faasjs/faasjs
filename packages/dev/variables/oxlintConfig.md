[@faasjs/dev](../README.md) / oxlintConfig

# Variable: oxlintConfig

> `const` **oxlintConfig**: `NonNullable`\<`UserConfig`\[`"lint"`\]\>

Shared Oxlint configuration used by FaasJS projects.

## Example

```ts
import { defineConfig } from 'vite-plus'
import { oxlintConfig } from '@faasjs/dev'

export default defineConfig({
  lint: oxlintConfig,
})
```
