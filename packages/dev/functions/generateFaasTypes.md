[@faasjs/dev](../README.md) / generateFaasTypes

# Function: generateFaasTypes()

> **generateFaasTypes**(`options?`): `Promise`\<[`GenerateFaasTypesResult`](../type-aliases/GenerateFaasTypesResult.md)\>

Generate `src/.faasjs/types.d.ts` for a FaasJS project.

The generator scans the `src/` tree for `.api.ts` files, converts file
names into routes, and keeps the most specific file when multiple files resolve to
the same route. Route precedence is: regular `*.api.ts` files, then `index.api.ts`,
then fallback `default.api.ts` files. Fallback files emit wildcard routes such as
`*` and `users/*`, while root and index files emit `/` or the directory route.

Generated route keys omit the leading slash except for `/`; for example,
`src/users/default.api.ts` becomes `users/*`.

## Parameters

### options?

[`GenerateFaasTypesOptions`](../type-aliases/GenerateFaasTypesOptions.md) = `{}`

Project root and logger overrides.

## Returns

`Promise`\<[`GenerateFaasTypesResult`](../type-aliases/GenerateFaasTypesResult.md)\>

Summary describing the generated file and discovered routes.

## Throws

When the resolved `src/` directory does not exist.

## Example

```ts
import { generateFaasTypes } from '@faasjs/dev'

const result = await generateFaasTypes({
  root: process.cwd(),
})

console.log(result.output, result.routeCount)
```
