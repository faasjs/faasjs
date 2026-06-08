[@faasjs/types](../README.md) / FaasActionPaths

# Type Alias: FaasActionPaths

> **FaasActionPaths** = `Extract`\<keyof `FaasActions`, `string`\>

Union of all declared action path string literals.

Used internally by [FaasParams](FaasParams.md) and [FaasData](FaasData.md) to
resolve parameter and response types by action path.
Resolves to `never` until `FaasActions` is augmented, usually by the
generated `src/.faasjs/types.d.ts` file being included in `tsconfig.json`.

## See

- [FaasParams](FaasParams.md)
- [FaasData](FaasData.md)
