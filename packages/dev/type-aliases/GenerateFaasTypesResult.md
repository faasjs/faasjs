[@faasjs/dev](../README.md) / GenerateFaasTypesResult

# Type Alias: GenerateFaasTypesResult

> **GenerateFaasTypesResult** = `object`

Summary returned by [generateFaasTypes](../functions/generateFaasTypes.md).

## Properties

### changed

> **changed**: `boolean`

Whether the generator wrote new content to disk.

***

### fileCount

> **fileCount**: `number`

Number of `*.api.ts` files discovered under `src/`, including files that lose
route precedence to a more specific file.

***

### jobCount

> **jobCount**: `number`

Number of `.job.ts` paths emitted into the declaration file.

***

### output

> **output**: `string`

Output path of the generated declaration file.

***

### routeCount

> **routeCount**: `number`

Number of route entries emitted into the declaration file after duplicate
routes are resolved by precedence.
