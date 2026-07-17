[**@faasjs/jobs**](../README.md)

[@faasjs/jobs](../README.md) / LoadJobRegistryOptions

# Type Alias: LoadJobRegistryOptions

> **LoadJobRegistryOptions** = `object`

Options for loading job definitions from the filesystem.

## Properties

### logger?

> `optional` **logger?**: `Logger`

Logger instance.

### root?

> `optional` **root?**: `string`

Root directory for job file discovery. Auto-detected when omitted.

### staging?

> `optional` **staging?**: `string`

Staging environment name. Defaults to `process.env.FaasEnv` or `'development'`.
