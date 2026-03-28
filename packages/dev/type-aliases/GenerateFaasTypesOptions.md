[@faasjs/dev](../README.md) / GenerateFaasTypesOptions

# Type Alias: GenerateFaasTypesOptions

> **GenerateFaasTypesOptions** = `object`

Options for generating `@faasjs/types` route declarations.

## Properties

### logger?

> `optional` **logger?**: `Logger`

Logger used to report generation progress.

### root?

> `optional` **root?**: `string`

Project root used to resolve `src/` and emit `src/.faasjs/types.d.ts`.

#### Default

```ts
process.cwd()
```
