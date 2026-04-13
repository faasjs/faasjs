# Routing Mapping Specification

## Background

FaasJS route resolution is file-based. This spec standardizes both API routing and webpage routing so Zero-Mapping remains explicit: file path and URL path stay in one-to-one alignment by default.

Related references:

- `packages/core/src/server/routes.ts`
- `packages/core/src/server/__tests__/routes.test.ts`
- `documents/projects/faasjs/rfc-spa-api-zero-mapping-v0.1-short.md`

## Goals

- Keep API and webpage locations discoverable from URL without an extra mapping table.
- Reduce ambiguity for humans and AI coding agents.
- Keep route search order predictable across webpage rendering and API handling.

## Non-goals

- Introducing path aliases or rewrite layers.
- Replacing file-system routing with a registry-based router.
- Adding dynamic filename segments such as `[id]` or `[...slug]` in this V1 spec.
- Requiring a separate route configuration file for discovered pages.

## Normative Rules

### 1. File naming and placement

1. Webpage route root MUST be `src/pages`.
2. Webpage entry files MUST be named `index.tsx` or `default.tsx`.
3. Webpage entry files MUST default-export the page component.
4. A directory named `api/` is reserved for backend route files and MUST NOT create webpage routes.
5. API entry files MUST end with `.func.ts`.
6. API files SHOULD be placed under `api/` directories for SPA-style projects.
7. API files MUST NOT be placed under `components/` directories.
8. Files other than `index.tsx`, `default.tsx`, and `*.func.ts` MUST NOT create routes implicitly.

### 2. Zero-mapping routing

1. URL path and file path MUST keep direct mapping (Zero-Mapping by default).
2. Webpage routes map relative to `src/pages` and MUST NOT use a `/pages` URL prefix. These routes are resolved for webpage requests such as `GET` and `HEAD`.
3. API routes continue to map from the full path under `src/`; implementations MUST NOT rely on implicit rewrites such as `actions -> api`.
4. Implementations MUST NOT add hidden alias routes that break path/file predictability.

### 3. Webpage route file search order

Given browser path `<p>`, webpage route resolution MUST probe in this order:

1. `src/pages<p>/index.tsx`
2. `src/pages<p>/default.tsx`
3. Parent fallback chain: `src/pages<parent>/default.tsx` up to `src/pages/default.tsx`

Normalize `/` so the first probe is `src/pages/index.tsx`.

If no candidate exists, the request is treated as not found.
`default.tsx` acts as the fallback for the current scope and its descendants after exact `index.tsx` lookup misses.

### 4. Page module contract

1. A webpage route module MUST default-export the page component.
2. Route resolution MUST depend only on the discovered file path plus the default export.
3. Named exports MAY exist, but they MUST NOT affect route matching or page rendering semantics.
4. This V1 webpage routing spec MUST NOT require dynamic filename syntax; nested routing is represented only by directories plus `index.tsx` and `default.tsx`.

### 5. API route file search order

Given API request path `<p>`, route resolution MUST probe in this order:

1. `<p>.func.ts`
2. `<p>/index.func.ts`
3. `<p>/default.func.ts`
4. Parent fallback chain: `<parent>/default.func.ts` up to root scope

If no candidate exists, the request is treated as not found.

## Examples

### Webpages

| File                         | Route                                                                       |
| ---------------------------- | --------------------------------------------------------------------------- |
| `src/pages/index.tsx`        | `GET /`                                                                     |
| `src/pages/about/index.tsx`  | `GET /about`                                                                |
| `src/pages/docs/default.tsx` | fallback for `/docs` and unmatched `/docs/*` after exact page lookup misses |
| `src/pages/default.tsx`      | global fallback for unmatched webpage routes                                |

Webpage fallback example:

- Request: `GET /docs/react/routing`
- Probe order:
  1. `src/pages/docs/react/routing/index.tsx`
  2. `src/pages/docs/react/routing/default.tsx`
  3. `src/pages/docs/react/default.tsx`
  4. `src/pages/docs/default.tsx`
  5. `src/pages/default.tsx`

### APIs

| File                               | Route                                          |
| ---------------------------------- | ---------------------------------------------- |
| `src/pages/todo/api/list.func.ts`  | `POST /pages/todo/api/list`                    |
| `src/pages/todo/api/index.func.ts` | `POST /pages/todo/api`                         |
| `src/pages/todo/default.func.ts`   | fallback for `/pages/todo/*`                   |
| `src/pages/default.func.ts`        | fallback for unmatched routes under `/pages/*` |

API fallback example:

- Request: `POST /pages/todo/item/unknown`
- Probe order:
  1. `src/pages/todo/item/unknown.func.ts`
  2. `src/pages/todo/item/unknown/index.func.ts`
  3. `src/pages/todo/item/unknown/default.func.ts`
  4. `src/pages/todo/item/default.func.ts`
  5. `src/pages/todo/default.func.ts`
  6. `src/pages/default.func.ts`
