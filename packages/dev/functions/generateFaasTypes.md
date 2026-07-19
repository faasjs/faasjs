[**@faasjs/dev**](../README.md)

[@faasjs/dev](../README.md) / generateFaasTypes

# Function: generateFaasTypes()

> **generateFaasTypes**(`options?`): `Promise`\<[`GenerateFaasTypesResult`](../type-aliases/GenerateFaasTypesResult.md)>>>>\>

Generate `src/.faasjs/types.d.ts` for a FaasJS project.

The generator scans the `src/` tree for `.api.ts` and `.job.ts` files. API
names become routes, while job names become path identifiers with `.job.ts`
removed and trailing `/index` collapsed. Duplicate job paths are rejected.
API route precedence is: regular `*.api.ts` files, then `index.api.ts`, then
fallback `default.api.ts` files.

Generated route keys omit the leading slash except for `/`; for example,
`src/users/default.api.ts` becomes `users/*`.

## Parameters

### options?

[`GenerateFaasTypesOptions`](../type-aliases/GenerateFaasTypesOptions.md) = `{}`

Project root and logger overrides.

## Returns

`Promise`\<[`GenerateFaasTypesResult`](../type-aliases/GenerateFaasTypesResult.md)\>

Summary describing the generated file, routes, and jobs.

## Throws

When the resolved `src/` directory does not exist.

## Example

```ts
import { generateFaasTypes } from '@faasjs/dev'

const result = await generateFaasTypes({
  root: process.cwd(),
})

console.log(result.output, result.routeCount, result.jobCount)
```
