[**@faasjs/dev**](../README.md)

[@faasjs/dev](../README.md) / OxlintConfig

# Variable: OxlintConfig

> `const` **OxlintConfig**: `NonNullable`\<`UserConfig`\[`"lint"`\]\>

Shared Oxlint configuration used by FaasJS projects.

Enables TypeScript, React, Node, Vitest, Unicorn, ESLint, Import, and JSDoc
plugins with type-aware checking. The most opinionated rule is
[no-unused-vars](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-vars.html)
with `argsIgnorePattern: '^_'`, while
[consistent-type-imports](https://oxc.rs/docs/guide/usage/linter/rules/typescript/consistent-type-imports.html)
enforces `type`-only imports.
Generated output under `dist/`, `.faasjs/`, and `node_modules/` is ignored by default.

## Example

```ts
import { defineConfig } from 'vite-plus'
import { OxlintConfig } from '@faasjs/dev'

export default defineConfig({
  lint: OxlintConfig,
})
```
