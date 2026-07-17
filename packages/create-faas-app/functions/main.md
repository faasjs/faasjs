[create-faas-app](../README.md) / main

# Function: main()

> **main**(`argv`): `Promise`\<`Command`>>>>>>>>>>>>\>

Run the `create-faas-app` CLI with a provided argv array.

The array should use the same shape as `process.argv`, including executable
and script slots. Parsing may prompt for a project name, create files, install
dependencies, generate FaasJS action types, and run template tests. Commander
help exits are swallowed and return the shared program; unexpected errors are
printed with `console.error` and also return the program.

## Parameters

### argv

`string`[]

CLI arguments forwarded to Commander.

## Returns

`Promise`\<`Command`\>

Commander program instance after parsing.

## Example

```ts
import { main } from 'create-faas-app'

await main(['node', 'create-faas-app', '--help'])
```
