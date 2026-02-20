# Routing Mapping Specification

Chinese: [路由映射规范](./routing-mapping.zh.md)

## Metadata

- Status: Accepted
- Version: v1.0
- Owner: FaasJS Maintainers
- Applies To: `@faasjs/core`, `create-faas-app`, and API projects built on FaasJS
- Last Updated: 2026-02-19

## Background

FaasJS route resolution is file-based. This spec standardizes the mapping and keeps the Zero-Mapping default explicit: file path and URL path stay in one-to-one alignment.

Related references:

- `packages/core/src/server/routes.ts`
- `packages/core/src/server/__tests__/routes.test.ts`
- `documents/projects/faasjs/rfc-spa-api-zero-mapping-v0.1-short.md`

## Goals

- Keep API location discoverable from URL without an extra mapping table.
- Reduce ambiguity for humans and AI coding agents.
- Keep behavior aligned with current server route search order.

## Non-goals

- Introducing path aliases or rewrite layers.
- Replacing file-system routing with a registry-based router.

## Normative Rules

### 1. File naming and placement

1. API entry files MUST end with `.func.ts`.
2. API files SHOULD be placed under `api/` directories for SPA-style projects.
3. API files MUST NOT be placed under `components/` directories.

### 2. Zero-mapping routing

1. URL path and file path MUST keep direct mapping (Zero-Mapping by default).
2. Implementations MUST NOT rely on implicit rewrites such as `actions -> api`.
3. Implementations MUST NOT add hidden alias routes that break path/file predictability.

### 3. Route file search order

Given request path `<p>`, route resolution MUST probe in this order:

1. `<p>.func.ts`
2. `<p>/index.func.ts`
3. `<p>/default.func.ts`
4. Parent fallback chain: `<parent>/default.func.ts` up to root scope

If no candidate exists, the request is treated as not found.

## Examples

| File                               | Route                                           |
| ---------------------------------- | ----------------------------------------------- |
| `src/pages/todo/api/list.func.ts`  | `POST /todo/api/list`                           |
| `src/pages/todo/api/index.func.ts` | `POST /todo/api`                                |
| `src/pages/todo/default.func.ts`   | fallback for `/todo/*`                          |
| `src/pages/default.func.ts`        | fallback for unmatched routes under `src/pages` |

Fallback example:

- Request: `POST /todo/item/unknown`
- Probe order:
  1. `src/pages/todo/item/unknown.func.ts`
  2. `src/pages/todo/item/unknown/index.func.ts`
  3. `src/pages/todo/item/unknown/default.func.ts`
  4. `src/pages/todo/item/default.func.ts`
  5. `src/pages/todo/default.func.ts`
  6. `src/pages/default.func.ts`

## Compatibility

- Existing projects with `actions/` naming can continue to run, but new or migrated code SHOULD use `api/` naming.
- Legacy docs and RFC notes remain unchanged in this phase.

## Migration Checklist

- [ ] Remove custom route rewrite/alias logic from app layer.
- [ ] Rename API folders from `actions/` to `api/` where applicable.
- [ ] Ensure all API files use `.func.ts` suffix.
- [ ] Ensure `components/` contains no API handlers.
