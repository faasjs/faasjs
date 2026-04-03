[@faasjs/dev](../README.md) / GenerateFaasTypesResult

# Type Alias: GenerateFaasTypesResult

> **GenerateFaasTypesResult** = `object`

Summary returned by [generateFaasTypes](../functions/generateFaasTypes.md).

## Properties

### changed

> **changed**: `boolean`

Whether the generator wrote new content to disk.

### fileCount

> **fileCount**: `number`

Number of `*.func.ts` files discovered under `src/`.

### output

> **output**: `string`

Output path of the generated declaration file.

### routeCount

> **routeCount**: `number`

Number of route entries emitted into the declaration file.
