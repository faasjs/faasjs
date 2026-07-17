---
name: faasjs-api-jobs
description: 'Use when building or reviewing FaasJS backend APIs and jobs: .api.ts files, defineApi, zod params schemas, HttpError, HTTP helpers, middleware/staticHandler, .job.ts files, defineJob, typed job paths and params, enqueueJob including transaction-coupled enqueueing, cron schedulers, retries, leases, workers, discovery, and job tests.'
---

# FaasJS API And Jobs

## Default Workflow

1. Keep API and job files inside the feature slice that owns the behavior.
2. Define external input schemas at the boundary and keep business input visible as `params.key`.
3. Use `HttpError` with explicit status codes for expected API failures; reserve plain `Error` for internal failures.
4. Use injected HTTP helpers for cookies, sessions, headers, status, body, and content type.
5. Treat jobs as at-least-once execution, make enqueueing explicit, and keep generated paths aligned with runtime discovery.

## Load These References

- `.api.ts`, `defineApi`, schemas, `params`, errors, injected fields, and type generation: `references/guidelines/define-api.md`.
- Cookies, sessions, response helpers, and HTTP plugin config: `references/guidelines/http-plugin.md`.
- Static file serving and middleware: `references/guidelines/middleware.md`.
- `.job.ts`, `defineJob`, `enqueueJob`, process ownership, and transaction-coupled enqueueing: `references/guidelines/jobs.md`.
- Generated job paths, params types, typegen, duplicate paths, and discovery roots: `references/guidelines/job-types-and-paths.md`.
- Cron expressions, scheduler deduplication, retries, attempts, and lease expiry: `references/guidelines/job-scheduling-and-retries.md`.
- Direct handler, queue, worker, scheduler, transaction, type, and discovery tests: `references/guidelines/job-testing.md`.

## Gotchas

- Destructure only the top-level handler context, such as `handler({ params })`; do not destructure business fields from `params`.
- Run `npx faas types` after adding, renaming, moving, or removing `.api.ts` or `.job.ts` files; ordinary handler edits do not change path declarations.
- Do not cast dynamic strings to generated job paths or keep transaction clients after their callbacks.
- Check user, tenant, organization, project, role, or permission scope before reading or mutating data.
- Do not log secrets, tokens, passwords, cookies, full sensitive payloads, or unredacted third-party responses.

## Validation

- Run focused API or job tests with `vp test <pattern>`.
- Run `npx faas types` after API or job path topology changes.
- Run `vp check --fix` before handoff when backend files changed.
