# Routing Mapping Specification

## Background

FaasJS API route resolution is file-system based. This specification standardizes backend routing mapping so that Zero-Mapping stays explicit: by default, file paths correspond one-to-one with request paths.

Frontend page components may still live under `src/pages`, but FaasJS no longer auto-discovers web routes for React applications. Browser routing is an application concern and is outside the scope of this specification.

Related references:

- `packages/core/src/server/routes.ts`
- `packages/core/src/server/routes.test.ts`
- `documents/projects/faasjs/rfc-spa-api-zero-mapping-v0.1-short.md`

## Goals

- Keep API locations directly derivable from request paths without an extra mapping table.
- Reduce ambiguity for humans and AI coding agents.
- Keep backend route search order predictable.

## Non-Goals

- Introduce path aliases or a rewrite layer.
- Replace file-system routing with a registry-based approach.
- Add dynamic file-name syntax such as `[id]` or `[...slug]` in this V1 specification.
- Define browser routing or SPA page discovery behavior.

## Normative Rules

### 1. File Naming and Placement

1. API entry files MUST end with `.api.ts`.
2. In SPA-style projects, API files SHOULD be placed under the `api/` directory.
3. API files MUST NOT be placed under `components/` directories.
4. Files other than `*.api.ts` MUST NOT implicitly generate API routes.

### 2. Zero-Mapping Routing

1. Request paths MUST maintain a direct mapping to file paths (Zero-Mapping by default).
2. API routes MUST be established from the full path under `src/`; the implementation MUST NOT rely on implicit rewrites such as `actions -> api`.
3. The implementation MUST NOT add hidden alias routes that would break path/file predictability.

### 3. API Route File Search Order

Given an API request path `<p>`, route resolution MUST probe in the following order:

1. `<p>.api.ts`
2. `<p>/index.api.ts`
3. `<p>/default.api.ts`
4. Parent fallback chain: from `<parent>/default.api.ts` back to the root scope

If no candidate file is found, the request is considered not found.

## Examples

| File                              | Route                             |
| --------------------------------- | --------------------------------- |
| `src/pages/todo/api/list.api.ts`  | `POST /pages/todo/api/list`       |
| `src/pages/todo/api/index.api.ts` | `POST /pages/todo/api`            |
| `src/pages/todo/default.api.ts`   | fallback for `/pages/todo/*`      |
| `src/pages/default.api.ts`        | fallback for unmatched `/pages/*` |

API fallback example:

- Request: `POST /pages/todo/item/unknown`
- Probe order:
  1. `src/pages/todo/item/unknown.api.ts`
  2. `src/pages/todo/item/unknown/index.api.ts`
  3. `src/pages/todo/item/unknown/default.api.ts`
  4. `src/pages/todo/item/default.api.ts`
  5. `src/pages/todo/default.api.ts`
  6. `src/pages/default.api.ts`
