# YAML Guide

Use this guide when you need to parse YAML text directly in FaasJS projects using `parseYaml` from `@faasjs/utils`.

## Applicable Scenarios

- Parsing YAML configuration text in custom tooling or scripts
- Building config objects from YAML fragments
- Validating YAML structure in CLI tools or development scripts

## What `@faasjs/utils` Gives You

- `parseYaml` — parse the YAML subset supported by FaasJS, or validate it with a Zod schema

## Default Workflow

1. Use `parseYaml()` for direct YAML text parsing in custom tooling or scripts.
2. Use `parseYaml(raw, schema)` when you want Zod validation and a schema-derived output type.
3. For `faas.yaml` config with staged discovery and merging, use `loadConfig()` from `@faasjs/node-utils` instead (see Node Utils Guide).
4. Validate the parsed YAML shape with Zod schemas from `@faasjs/utils`.
5. Do not import `parseYaml` from `@faasjs/node-utils`; the public parser entrypoint is `@faasjs/utils`.

## Common Patterns

### 1. Parse YAML text directly

Use `parseYaml` when your script receives YAML text directly and you want the same supported subset and error messages as FaasJS config parsing. Pass a Zod schema as the second argument when you want runtime validation and the schema output type.

```ts
import { parseYaml, z } from '@faasjs/utils'

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

const frontmatter = parseYaml(
  `title: Docs
description: >
  Generated reference pages
  for FaasJS users.
priority: 1
`,
  z.object({
    description: z.string(),
    priority: z.number().default(0),
    title: z.string(),
  }),
)
// frontmatter is { description: string; priority: number; title: string }
```

## Review Checklist

- `parseYaml` is used for direct YAML text parsing
- `parseYaml` is imported from `@faasjs/utils`
- `loadConfig()` is used instead for staged `faas.yaml` discovery and merging
- parsed YAML shape uses `parseYaml(raw, schema)` or is validated after parsing when shape matters
