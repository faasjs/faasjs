[@faasjs/node-utils](../README.md) / parseYaml

# Function: parseYaml()

> **parseYaml**(`content`): `unknown`

Parse the FaasJS-supported YAML subset into JavaScript values.

Use this in custom Node.js tooling when you need the same YAML surface area as
`faas.yaml` without staged discovery or schema validation. Prefer
`loadConfig()` when you want FaasJS to resolve layered config files for a
function.

## Parameters

### content

`string`

YAML source text.

## Returns

`unknown`

Parsed value, or `undefined` when the input only contains blank lines or comments.

## Throws

If the YAML uses unsupported syntax or cannot be parsed.

## Example

```ts
import { parseYaml } from '@faasjs/node-utils'

const value = parseYaml(`defaults:
  plugins:
    http:
      type: http
      config:
        cookie:
          session:
            secret: replace-me
`)
```
