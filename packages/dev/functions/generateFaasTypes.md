[@faasjs/dev](../README.md) / generateFaasTypes

# Function: generateFaasTypes()

> **generateFaasTypes**(`options?`): `Promise`\<[`GenerateFaasTypesResult`](../type-aliases/GenerateFaasTypesResult.md)\>

Generate `src/.faasjs/types.d.ts` for a FaasJS project.

## Parameters

### options?

[`GenerateFaasTypesOptions`](../type-aliases/GenerateFaasTypesOptions.md) = `{}`

Project root and optional logger.

## Returns

`Promise`\<[`GenerateFaasTypesResult`](../type-aliases/GenerateFaasTypesResult.md)\>

Summary describing the generated file and discovered routes.

## Example

```ts
import { generateFaasTypes } from '@faasjs/dev'

const result = await generateFaasTypes({
  root: process.cwd(),
})

console.log(result.output, result.routeCount)
```
