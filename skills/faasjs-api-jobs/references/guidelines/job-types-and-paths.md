# Job Types and Paths Guide

Use this guide when generating job declarations, resolving `.job.ts` paths, or diagnosing compile-time and runtime path mismatches.

## Generated Contract

`faas types` scans `.job.ts` files and augments `@faasjs/types` with `FaasJobs`. Public enqueueing uses:

- `FaasJobPaths`: the union of generated job paths
- `FaasJobParams<Path>`: the params required by one generated path
- `InferFaasJob`: the helper used in generated declarations
- `enqueueJob(path, params)`: accepts only a generated path and its inferred params

Do not cast dynamic strings to `FaasJobPaths` or widen params to `any`. Add or move the `.job.ts` file, regenerate declarations, and fix the caller against the generated contract.

Jobs without a schema use `Record<string, never>` for params, so callers must pass `{}`.

Keep compatible versions of `@faasjs/jobs` and its `@faasjs/types` peer dependency so the generated declarations and public enqueue overload agree.

## Path Mapping

Job paths are relative to the source or discovery root, use `/` separators, remove `.job.ts`, and collapse a trailing `/index`:

```text
src/features/users/jobs/cleanup.job.ts -> features/users/jobs/cleanup
src/features/emails/jobs/send.job.ts   -> features/emails/jobs/send
src/features/reports/jobs/index.job.ts -> features/reports/jobs
src/index.job.ts                       -> ""
```

Moving or renaming a job file changes its public path. Update callers and regenerate types in the same change.

The following files collide and must be rejected because both resolve to `jobs/reports`:

```text
src/jobs/reports.job.ts
src/jobs/reports/index.job.ts
```

Do not resolve a collision with a type cast. Rename one job so every runtime path has exactly one definition.

## Keep Typegen And Discovery Roots Aligned

`faas types` resolves the project through server config and scans `<resolved-project-root>/src`. Runtime discovery uses an explicit `root` when provided; otherwise it uses `<cwd>/src` when that directory exists, then falls back to the current directory.

When `defaults.server.root` moves the application under another directory, pass the matching source root to worker and scheduler startup. For example, if typegen scans `app/src`, use `startJobWorker({ root: 'app/src' })` and the same root for the scheduler.

Generated types prove that a path existed during generation; they do not prove the worker can currently discover that file. A moved or deleted job can still compile against stale declarations until typegen runs again.

## Type Generation Workflow

Run typegen after creating, renaming, moving, or removing `.api.ts` or `.job.ts` files:

```bash
npx faas types
```

Editing only a handler or schema does not require a path declaration rewrite because the generated file imports the endpoint or job type. Running typegen again is safe but should not be used as a substitute for typechecking.

Programmatic callers can inspect all counters:

```ts
import { generateFaasTypes } from '@faasjs/dev'

const result = await generateFaasTypes({ root: process.cwd() })
console.log(result.output, result.routeCount, result.jobCount)
```

Do not edit `src/.faasjs/types.d.ts` manually.

## Validation

- generate a job-only project successfully; an API file is not required
- reject duplicate job paths such as `reports.job.ts` and `reports/index.job.ts`
- typecheck one valid enqueue and assert unknown paths or incorrect params fail compilation
- run discovery with the production root and assert the generated paths match the registry keys
- regenerate after path topology changes and confirm stale paths disappear
