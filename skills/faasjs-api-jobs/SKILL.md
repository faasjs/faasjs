---
name: faasjs-api-jobs
description: 'Use when building or reviewing FaasJS backend APIs and jobs: .api.ts files, defineApi, zod params schemas, HttpError, injected HTTP helpers, cookies, sessions, response helpers, middleware/staticHandler, .job.ts files, defineJob, enqueueJob, schedulers, workers, and job tests.'
---

# FaasJS API And Jobs

## Default Workflow

1. Keep API and job files inside the feature slice that owns the behavior.
2. Define external input schemas at the boundary and keep business input visible as `params.key`.
3. Use `HttpError` with explicit status codes for expected API failures; reserve plain `Error` for internal failures.
4. Use injected HTTP helpers for cookies, sessions, headers, status, body, and content type.
5. Treat jobs as at-least-once execution and make enqueueing explicit.

## Load These References

- `.api.ts`, `defineApi`, schemas, `params`, errors, injected fields, and type generation: `references/guidelines/define-api.md`.
- Cookies, sessions, response helpers, and HTTP plugin config: `references/guidelines/http-plugin.md`.
- Static file serving and middleware: `references/guidelines/middleware.md`.
- `.job.ts`, `defineJob`, `enqueueJob`, worker/scheduler behavior, retries, and tests: `references/guidelines/jobs.md`.

## Gotchas

- Destructure only the top-level handler context, such as `handler({ params })`; do not destructure business fields from `params`.
- Run `npx faas types` after adding, moving, or removing `.api.ts` or `.job.ts` files.
- Check user, tenant, organization, project, role, or permission scope before reading or mutating data.
- Do not log secrets, tokens, passwords, cookies, full sensitive payloads, or unredacted third-party responses.

## Validation

- Run focused API or job tests with `vp test <pattern>`.
- Run `npx faas types` after API or job file changes.
- Run `vp check --fix` before handoff when backend files changed.
