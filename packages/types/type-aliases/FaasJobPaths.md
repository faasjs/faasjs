[**@faasjs/types**](../README.md)

[@faasjs/types](../README.md) / FaasJobPaths

# Type Alias: FaasJobPaths

> **FaasJobPaths** = `Extract`\<keyof `FaasJobs`, `string`>>>>\>

Union of all declared `.job.ts` path string literals.

Resolves to `never` until `FaasJobs` is augmented, usually by the
generated `src/.faasjs/types.d.ts` file.
