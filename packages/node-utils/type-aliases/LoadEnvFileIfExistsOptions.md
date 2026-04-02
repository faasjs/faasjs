[@faasjs/node-utils](../README.md) / LoadEnvFileIfExistsOptions

# Type Alias: LoadEnvFileIfExistsOptions

> **LoadEnvFileIfExistsOptions** = `object`

Options for [loadEnvFileIfExists](../functions/loadEnvFileIfExists.md).

## Properties

### cwd?

> `optional` **cwd?**: `string`

Working directory used to resolve the env file path.

#### Default

```ts
process.cwd()
```

---

### filename?

> `optional` **filename?**: `string`

Env filename relative to `cwd`.

#### Default

```ts
'.env'
```
