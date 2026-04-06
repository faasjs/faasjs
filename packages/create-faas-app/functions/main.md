[create-faas-app](../README.md) / main

# Function: main()

> **main**(`argv`): `Promise`\<`Command`\>

Run the `create-faas-app` CLI with a provided argv array.

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
