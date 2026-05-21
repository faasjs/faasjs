# YAML Guide

Use this guide when you need to parse YAML text directly in FaasJS projects using `parseYaml` from `@faasjs/utils`.

## Applicable Scenarios

- Parsing YAML configuration text in custom tooling or scripts
- Building config objects from YAML fragments
- Validating YAML structure in CLI tools or development scripts

## What `@faasjs/utils` Gives You

- `parseYaml` — parse the YAML subset supported by FaasJS

## Common Patterns

### 1. Parse YAML text directly

Use `parseYaml` when your script receives YAML text directly and you want the same supported subset and error messages as FaasJS config parsing.

```ts
import { parseYaml } from '@faasjs/utils'

const config = parseYaml(`defaults:
  plugins:
    http:
      type: http
      config:
        cookie:
          session:
            secret: 'replace-me'
`)

console.log(config)
```

## Review Checklist

- `parseYaml` is used for direct YAML text parsing
- parsed YAML shape is validated after parsing (e.g. with Zod schemas from `@faasjs/utils`)
