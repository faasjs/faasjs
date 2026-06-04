# Routing Mapping Specification

## Background

FaasJS API route resolution is file-based. This spec standardizes backend route
mapping so Zero-Mapping remains explicit: file path and request path stay in
one-to-one alignment by default.

Frontend page components may still live under `src/pages`, but FaasJS does not
auto-discover webpage routes for React applications anymore. Browser routing is
an application concern and is out of scope for this spec.

Related references:

- `packages/core/src/server/routes.ts`
- `packages/core/src/server/routes.test.ts`
- `documents/projects/faasjs/rfc-spa-api-zero-mapping-v0.1-short.md`

## Goals

- Keep API locations discoverable from the request path without an extra mapping table.
- Reduce ambiguity for humans and AI coding agents.
- Keep backend route search order predictable.

## Non-goals

- Introducing path aliases or rewrite layers.
- Replacing file-system routing with a registry-based router.
- Adding dynamic filename segments such as `[id]` or `[...slug]` in this V1 spec.
- Defining browser routing or SPA page discovery behavior.

## Normative Rules

### 1. File naming and placement

1. API entry files MUST end with `.api.ts`.
2. API files SHOULD be placed under `api/` directories for SPA-style projects.
3. API files MUST NOT be placed under `components/` directories.
4. Files other than `*.api.ts` MUST NOT create API routes implicitly.

### 2. Zero-mapping routing

1. Request path and file path MUST keep direct mapping (Zero-Mapping by default).
2. API routes MUST map from the full path under `src/`; implementations MUST NOT rely on implicit rewrites such as `actions -> api`.
3. Implementations MUST NOT add hidden alias routes that break path/file predictability.

### 3. API route file search order

Given API request path `<p>`, route resolution MUST probe in this order:

1. `<p>.api.ts`
2. `<p>/index.api.ts`
3. `<p>/default.api.ts`
4. Parent fallback chain: `<parent>/default.api.ts` up to root scope

If no candidate exists, the request is treated as not found.

## Examples

| File                              | Route                                          |
| --------------------------------- | ---------------------------------------------- |
| `src/pages/todo/api/list.api.ts`  | `POST /pages/todo/api/list`                    |
| `src/pages/todo/api/index.api.ts` | `POST /pages/todo/api`                         |
| `src/pages/todo/default.api.ts`   | fallback for `/pages/todo/*`                   |
| `src/pages/default.api.ts`        | fallback for unmatched routes under `/pages/*` |

API fallback example:

- Request: `POST /pages/todo/item/unknown`
- Probe order:
  1. `src/pages/todo/item/unknown.api.ts`
  2. `src/pages/todo/item/unknown/index.api.ts`
  3. `src/pages/todo/item/unknown/default.api.ts`
  4. `src/pages/todo/item/default.api.ts`
  5. `src/pages/todo/default.api.ts`
  6. `src/pages/default.api.ts`
