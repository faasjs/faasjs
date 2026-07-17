[**@faasjs/dev**](../README.md)

[@faasjs/dev](../README.md) / GenerateFaasTypesOptions

# Type Alias: GenerateFaasTypesOptions

> **GenerateFaasTypesOptions** = `object`

Options for generating `@faasjs/types` API and job declarations.

## Properties

### logger?

> `optional` **logger?**: `Logger`

Logger used to report generation progress.

### root?

> `optional` **root?**: `string`

Project root passed through FaasJS server config resolution.

When `src/faas.yaml` contains `defaults.server.root`, generation runs from that
resolved project root and emits `src/.faasjs/types.d.ts` beneath it.

#### Default

```ts
process.cwd()
```
