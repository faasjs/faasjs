# Validation Guide

Use this guide when you need to validate data in FaasJS projects — whether at system boundaries, in custom Node-side code, or in portable helpers.

## Applicable Scenarios

- Validating data with Zod schemas using the extended `z` instance
- Narrowing `unknown` types with type guards like `isObjectRecord`
- Parsing and validating values against optional Zod schemas in Node-only code
- Formatting Zod validation error messages
- Validating that resolved file paths stay within an allowed root directory

## What `@faasjs/utils` and `@faasjs/node-utils` Give You

- `z` (from `@faasjs/utils`) — extended Zod instance with convenience helpers (`positiveint`, `nonemptystring`)
- `isObjectRecord` (from `@faasjs/utils`) — type guard that checks if a value is a plain object
- `parseSchemaValue` (from `@faasjs/node-utils`) — parse and validate a value against an optional Zod schema
- `formatSchemaError` (from `@faasjs/node-utils`) — format Zod validation error messages without throwing
- `SchemaOutput` (from `@faasjs/node-utils`) — utility type that follows a Zod schema output type
- `isPathInsideRoot` (from `@faasjs/node-utils`) — validate that a resolved path stays inside a root directory

## Default Workflow

1. Use `z` (the extended Zod) instead of bare `zod` for FaasJS projects.
2. In `defineApi`/`defineJob` handlers, use the injected `params` — do not call `parseSchemaValue` there.
3. Use `parseSchemaValue` only in custom Node-side boundaries (CLIs, worker adapters, loaders).
4. Use `isPathInsideRoot` before opening files resolved from user-controlled paths.
5. Use `formatSchemaError` only when you need the formatted message without throwing.

## Common Patterns

### 1. Validate data with Zod schemas

Use `z` (the extended Zod instance) instead of importing bare `zod` for FaasJS projects. `z.positiveint()` returns a schema that only allows positive integers. `z.nonemptystring()` returns a schema that only allows non-empty strings.

```ts
import { z } from '@faasjs/utils'

const schema = z.object({
  name: z.nonemptystring(),
  age: z.positiveint(),
})
```

### 2. Narrow unknown types with `isObjectRecord`

Use `isObjectRecord` as a type guard in generic code to narrow `unknown` to `Record<string, unknown>`.

```ts
import { isObjectRecord } from '@faasjs/utils'

function process(value: unknown) {
  if (isObjectRecord(value)) {
    // value is narrowed to Record<string, unknown>
    console.log(Object.keys(value))
  }
}
```

### 3. Use schema helpers for custom Node boundaries

`defineApi` and `defineJob` already parse their own schemas, so application handlers should use their injected `params`. Use `parseSchemaValue` when a CLI, worker adapter, loader, or other Node-only boundary needs the same optional-schema behavior; omitted schemas and nullish input default to `{}` unless you pass `defaultValue`.

Use `SchemaOutput<TSchema, TFallback>` when a public helper type should follow a Zod schema output type and fall back when the schema is omitted.

Use `formatSchemaError` only when you need the formatted validation message without throwing.

```ts
import { parseSchemaValue } from '@faasjs/node-utils'
import { z } from '@faasjs/utils'

const params = await parseSchemaValue({
  schema: z.object({
    count: z.coerce.number().int().positive(),
  }),
  value: input,
  errorMessage: 'Invalid params',
})
```

### 4. Validate root-scoped file paths with `isPathInsideRoot`

Use `isPathInsideRoot` before opening files resolved from request URLs, CLI arguments, config values, or any other user-controlled fragments.

It normalizes both paths, follows existing symlinks with `realpath`, and still handles missing target files by normalizing through the nearest existing parent directory. This makes it suitable for guarding static file serving, route lookup, template resolution, or any logic that must reject `../` traversal and symlink escapes.

Resolve the candidate path first, then validate that resolved path against the intended root.

```ts
import { isPathInsideRoot } from '@faasjs/node-utils'
import { resolve } from 'node:path'

const root = resolve(process.cwd(), 'public')
const candidate = resolve(root, requestPath)

if (!isPathInsideRoot(candidate, root)) {
  throw Error('Path escapes the static root')
}
```

## Review Checklist

- Zod schema validation uses `@faasjs/utils` `z` instead of bare `zod` for consistency
- type guards use `isObjectRecord` over ad-hoc `typeof` checks when narrowing `unknown` to `Record`
- custom Node-side boundary validation uses `parseSchemaValue` instead of one-off Zod error formatting
- `formatSchemaError` is used only when the formatted message is needed without throwing
- root-scoped file access validates resolved paths with `isPathInsideRoot`
