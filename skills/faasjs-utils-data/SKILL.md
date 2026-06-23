---
name: faasjs-utils-data
description: 'Use when working with @faasjs/utils or FaasJS data helpers: deepMerge, streamToString, stringToStream, objectToStream, streamToObject, parseJson, parseObjectFromJson, parseArrayFromJson, parseYaml, z validation helpers, isObjectRecord, parseSchemaValue, formatSchemaError, and isPathInsideRoot.'
---

# FaasJS Utils And Data

## Default Workflow

1. Use the smallest helper that matches the payload shape.
2. Keep JSON helpers paired with JSON payloads and text helpers paired with text streams.
3. Use Zod schemas for external data validation and helper type guards for unknown internal values.
4. Use `parseYaml()` for direct YAML parsing; use `loadConfig()` when staged FaasJS config discovery is required.
5. Validate root-scoped paths before file access in Node-side tooling.

## Load These References

- Portable helpers and quick selection rules: `references/guidelines/utils.md`.
- JSON parsing and JSON stream helpers: `references/guidelines/json.md`.
- Direct YAML parsing: `references/guidelines/yaml.md`.
- Zod helpers, object narrowing, schema parsing, and path containment: `references/guidelines/valid.md`.

## Gotchas

- Do not replace internal control-flow checks with Zod schemas.
- `objectToStream` pairs with `streamToObject`; `stringToStream` pairs with `streamToString`.
- Use `loadConfig()` instead of direct YAML parsing when config staging and merge order matter.

## Validation

- Run focused unit tests with `vp test <pattern>` for helper behavior changes.
- Run `vp check --fix` before handoff when utility files changed.
