[**@faasjs/utils**](../README.md)

[@faasjs/utils](../README.md) / parseYaml

# Function: parseYaml()

## Call Signature

> **parseYaml**\<`T`>>>>\>(`content`): `T`

Parse the FaasJS-supported YAML subset into JavaScript values.

Supports the YAML subset used by `faas.yaml`: mappings, sequences, plain and quoted
scalars, literal and folded block scalars, inline comments, anchors, aliases,
booleans, numbers, nulls, arrays, and objects. Unsupported syntax throws an
`Error` whose message is prefixed with `[parseYaml]`.

Prefer `loadConfig()` from `@faasjs/node-utils` when you want FaasJS to resolve
layered config files for a function.

### Type Parameters

#### T

`T` = `unknown`

### Parameters

#### content

`string`

YAML source text.

### Returns

`T`

Parsed value, or `undefined` when the input only contains blank lines or comments.

### Throws

If the YAML uses unsupported syntax or cannot be parsed.

### Example

```ts
import { parseYaml } from '@faasjs/utils'

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

## Call Signature

> **parseYaml**\<`Schema`>>>>\>(`content`, `schema`): `output`\<`Schema`>>>>\>

Parses the FaasJS-supported YAML subset and validates it with a Zod schema.

Empty YAML content is parsed as `undefined` and then validated by the schema.

### Type Parameters

#### Schema

`Schema` _extends_ `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>

### Parameters

#### content

`string`

YAML source text.

#### schema

`Schema`

Zod schema used to validate the parsed value.

### Returns

`output`\<`Schema`\>

The Zod schema output.

### Throws

If the YAML uses unsupported syntax or cannot be parsed.

### Throws

If schema validation fails.
