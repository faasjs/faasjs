# File Conventions

FaasJS SPA + API uses zero-mapping routing: route paths are derived directly from `*.func.ts` file paths.

## Core Principle

> Where `.func.ts` lives is where the route lives. No extra alias, rewrite, or mapping layer.

## Project Structure

Recommended root: `src/pages`

```txt
src/pages/
  page-a/
    index.tsx
    components/
      header.tsx
    api/
      submit.func.ts
    feature-a/
      components/
        panel.tsx
      api/
        create.func.ts
        index.func.ts
```

## Special Files

| File | Purpose |
|------|---------|
| `index.tsx` | Page entry UI |
| `*.func.ts` | API endpoint file |
| `index.func.ts` | Segment root endpoint |
| `default.func.ts` | Fallback endpoint |

## Route Resolution Order

`@faasjs/server` resolves request URLs by probing file candidates in this order:

1. `path.func.ts`
2. `path/index.func.ts`
3. `path/default.func.ts`
4. Parent directory `default.func.ts` (fallback up the tree)

## Route Segments

- Static segment: each directory or file name in a `*.func.ts` path is a URL segment.
- Catch-all segment: use `default.func.ts` to match the rest of a path under a directory.
- Dynamic segment: there is no built-in `[id]`/`[...slug]` filename convention; use `default.func.ts` and parse path in handler logic.
- Groups: there is no hidden group directory convention (for example, `(group)`); directory names are not stripped from URLs.

## File-to-Route Mapping

- `src/pages/page-a/api/submit.func.ts` -> `POST /page-a/api/submit`
- `src/pages/page-a/feature-a/api/create.func.ts` -> `POST /page-a/feature-a/api/create`
- `src/pages/page-a/feature-a/api/index.func.ts` -> `POST /page-a/feature-a/api`

## Verb Naming Conventions

Use consistent action verbs in `*.func.ts` filenames to keep routes predictable.

- RESTful verbs: `create`, `update`, `delete`, `list`, `get`
- Naming pattern: `<verb>-<resource>` (kebab-case)
- Use singular resource for single-item actions (for example, `create-message`)
- Use plural resource for collection queries (for example, `list-messages`)
- Prefer these verbs over synonyms like `add`, `remove`, `fetch`

Examples:
- `create-message.func.ts` -> `POST /.../create-message`
- `list-messages.func.ts` -> `POST /.../list-messages`

## Verb Semantics

- `get-<resource>`: fetch a single resource (usually by ID or a unique key).
- `list-<resources>`: fetch a collection; support filters and pagination.
- `create-<resource>`: create one resource.
- `update-<resource>`: update an existing resource; treat as partial update unless contract says full replace.
- `delete-<resource>`: remove one resource; if implemented as soft delete, document it explicitly.

## List Endpoint Conventions

- Use deterministic sorting for `list-*` endpoints (for example, `created_at DESC, id DESC`).
- Use one pagination mode per endpoint:
  - Offset mode: `page`, `limit`
  - Cursor mode: `cursor`, `limit`
- Set safe limits: default `limit` to `20`, clamp to a max limit (recommended `100`).
- Return pagination metadata in `data` (`total/page/limit` or `nextCursor`).
- Validate filter and sort inputs; do not pass client-provided field names directly into SQL.

## Naming Anti-Patterns

- Avoid non-standard verbs: `add`, `remove`, `fetch`, `query`, `do`.
- Avoid vague action names: `handle-*`, `process-*`, `exec-*`.
- Avoid mixed tense or noun-only names: `created-message`, `messages.func.ts`.
- Keep API names domain-oriented; avoid embedding UI event wording in route names.

## API Placement Rules

- Put shared page APIs in `page-x/api/`
- Put feature-local APIs in `page-x/feature-y/api/`
- Keep UI in `components/` and APIs in `api/`

## Protocol Conventions

- Method: `POST`
- Content-Type: `application/json`
- Response shape (recommended):
  - Success: `{ "ok": true, "data": any, "error": null }`
  - Failure: `{ "ok": false, "data": null, "error": { "code": string, "message": string } }`

## Prohibited Patterns

1. Do not add path alias routing (for example, auto-mapping `/x/api/y` to `/x/y`).
2. Do not add directory semantic rewrite (for example, auto-converting `actions` to `api`).
3. Do not use `actions/` as the API directory name. Use `api/`.
4. Do not place `*.func.ts` under `components/`.

## Minimal Template

`src/pages/page-a/api/submit.func.ts`:

```ts
import { defineFunc } from '@faasjs/func'

export const func = defineFunc(async () => {
  return {
    accepted: true,
  }
})
```
