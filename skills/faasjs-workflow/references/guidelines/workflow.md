# Workflow Guide

Use this guide when defining or running persistent workflows with `@faasjs/workflow`.

## Default Workflow

1. Use `defineWorkflow(...)` for durable multi-step business processes that need persisted progress, recovery, branch tracking, or worker-based execution.
2. Use direct API or service code for short synchronous work, and use Jobs Guide for fire-and-forget background tasks without explicit step state.
3. Give each workflow a stable `type`, a single `root` step, and named step handlers that return `done`, `next`, `fork`, or `fail`.
4. Define `schemas` for every step when params have a shape, and define `metadataSchema` when tenant, actor, trace, priority, or policy data must follow the whole run.
5. Start persisted runs with `startWorkflow()`, process worker-owned steps with `runWorkflowStep()`, and reserve `runWorkflow()` for bounded local, test, script, or controlled resume flows.
6. Treat every step as at-least-once execution; make writes, external calls, and recovery transitions idempotent.

## Definition Pattern

```ts
import { defineWorkflow, done, fail, next } from '@faasjs/workflow'
import { z } from '@faasjs/utils'

export const orderWorkflow = defineWorkflow({
  type: 'order_fulfillment',
  root: 'reserveInventory',
  schemas: {
    reserveInventory: z.object({
      orderId: z.string(),
    }),
    capturePayment: z.object({
      orderId: z.string(),
    }),
    releaseInventory: z.object({
      orderId: z.string(),
    }),
  },
  metadataSchema: z.object({
    tenantId: z.string(),
    progress: z.object({
      reserved: z.boolean().optional(),
    }),
  }),
  steps: {
    async reserveInventory({ params, metadata, patchMetadata }) {
      await reserveInventoryForOrder(params.orderId, metadata.tenantId)
      await patchMetadata({
        progress: {
          reserved: true,
        },
      })

      return next('capturePayment', {
        orderId: params.orderId,
      })
    },
    async capturePayment({ params }) {
      try {
        await capturePaymentForOrder(params.orderId)

        return done({
          orderId: params.orderId,
        })
      } catch (error) {
        return fail(error, {
          next: {
            name: 'releaseInventory',
            params: {
              orderId: params.orderId,
            },
          },
        })
      }
    },
    async releaseInventory({ params }) {
      await releaseInventoryForOrder(params.orderId)

      return done()
    },
  },
})
```

## Rules

### 1. Choose workflows for explicit progress

Use `@faasjs/workflow` when a process needs persisted step records, visible progress, resumability, forked branches, or recoverable failure transitions.

Use `.job.ts` handlers alone when a single background task can own the whole operation with normal retry policy. Use an API handler directly when the caller should wait for all work before receiving the response.

### 2. Keep definitions explicit and stable

- Treat `type` as the durable workflow category stored in PostgreSQL.
- Keep `root` aligned with a real step handler.
- Keep step names stable once workflows may already be persisted.
- Export workflow definitions from feature-owned modules and import them from APIs, jobs, scripts, and tests.
- Do not rely on global workflow registration; pass the workflow definition explicitly to `startWorkflow()`, `runWorkflowStep()`, or `runWorkflow()`.

### 3. Validate step params and metadata

When `schemas` is provided, every step must have a matching schema and every schema must have a matching step. The package validates root params before startup and validates next/fork/recovery params before creating target steps.

Use `metadataSchema` for workflow-level context that every step may need, such as tenant, actor, organization, trace, policy, or priority data. Metadata is persisted on the workflow row and passed to every step handler after schema parsing.

Inside handlers, destructure only the top-level workflow context. Keep business values visible as `params.orderId` and `metadata.tenantId`.

### 4. Update metadata through the workflow context

Use `ctx.updateMetadata(...)` to replace workflow metadata and `ctx.patchMetadata(...)` to deep-merge small patches into metadata:

```ts
async reserveInventory({ params, metadata, patchMetadata }) {
  await reserveInventoryForOrder(params.orderId, metadata.tenantId)

  await patchMetadata({
    progress: {
      reserved: true,
    },
  })

  return next('capturePayment', {
    orderId: params.orderId,
  })
}
```

Both methods write immediately, validate the final metadata with `metadataSchema`, and update `ctx.metadata` with the persisted value. `patchMetadata()` locks the workflow row, reads the latest metadata, deep-merges the patch, and writes the result in one transaction so concurrent patches do not overwrite unrelated keys. `updateMetadata()` replaces the full metadata value and is last-write-wins after acquiring the workflow row lock.

Metadata updates are still persisted if the handler later throws or returns `fail(...)`. Keep metadata small and workflow-scoped. Use feature-owned business tables for large, high-frequency, audited, or query-heavy state.

### 5. Use the right execution entrypoint

Start a durable run from an API, command, script, or job:

```ts
import { startWorkflow } from '@faasjs/workflow'

import { orderWorkflow } from '../workflows/order'

const { workflowId } = await startWorkflow(orderWorkflow, {
  params: {
    orderId: 'order_001',
  },
  metadata: {
    tenantId: 'tenant_001',
  },
})
```

Run one claimable step from a worker-owned `.job.ts`:

```ts
import { defineJob } from '@faasjs/jobs'
import { runWorkflowStep } from '@faasjs/workflow'

import { orderWorkflow } from '../workflows/order'

export default defineJob({
  async handler() {
    await runWorkflowStep(orderWorkflow, {
      workerId: 'order-workflow-worker',
      leaseSeconds: 60,
    })
  },
})
```

Use `runWorkflow()` when the process should run until a terminal state in a controlled context:

```ts
import { runWorkflow } from '@faasjs/workflow'

const result = await runWorkflow(
  orderWorkflow,
  {
    params: {
      orderId: 'order_001',
    },
    metadata: {
      tenantId: 'tenant_001',
    },
  },
  {
    maxSteps: 20,
    timeoutMs: 30_000,
  },
)
```

Pass `{ workflowId }` to `runWorkflow()` to resume an existing workflow. Do not include `params` or `metadata` when resuming; those are creation-time inputs.

### 6. Return instructions instead of editing internal rows

- `done(data?)` marks the current step done and optionally stores JSON-serializable step data.
- `next(name, params?)` marks the current step done and creates one runnable next step.
- `fork(children)` marks the current step waiting and creates parallel child branch steps.
- `fail(error)` marks the current step failed and fails the workflow when no recovery step is attached.
- `fail(error, { next })` records the failed step and creates a recovery step, allowing the workflow to continue.

Do not write directly to `faasjs_workflows` or `faasjs_workflow_steps` from application code. The workflow runner owns status transitions, leases, fork branch heads, terminal-state resolution, and metadata updates exposed through the step context.

### 7. Design for at-least-once execution

`runWorkflowStep()` uses PostgreSQL row claiming, worker IDs, leases, and `SKIP LOCKED` to coordinate concurrent workers. A step can run again after process crashes, lease expiry, retry overlap, database interruption, or worker replacement.

- Use idempotency keys, unique constraints, and explicit state transitions around external side effects.
- Make recovery steps safe to run after partial progress.
- Choose `leaseSeconds` long enough for normal step duration but short enough to recover abandoned work.
- Provide stable `workerId` values when logs or debugging need to identify worker processes.
- Use `workflowId` when a worker or script must restrict claiming to one workflow; omit it for pooled workers processing any runnable workflow of that `type`.
- Treat metadata updates like any other at-least-once side effect; patch only idempotent fields or make the patch conditional through business data.

### 8. Keep fork branches independent

Use `fork(...)` for parallel child branches that can complete independently. The parent waits until all current branch heads are done or failed.

If a branch returns `next(...)`, the parent tracks the replacement branch head. If a branch returns `fail(error, { next })`, the failed branch is recorded and the recovery step becomes the branch head. If any branch head fails without recovery, the fork parent fails.

Keep branch params self-contained. Do not require branch handlers to read sibling branch step data unless the workflow explicitly persists shared state in metadata or business tables. Concurrent `patchMetadata()` calls serialize through the workflow row lock, but high-volume branch state still belongs in business tables.

### 9. Bound local full-run loops

`runWorkflow()` repeatedly calls `runWorkflowStep()` until the workflow is completed, failed, or cancelled. Always use limits in tests, scripts, and local orchestration where a stuck waiting workflow should not loop forever:

- `maxSteps` caps the number of claimed steps.
- `timeoutMs` caps total loop time.
- `pollIntervalMs` controls the delay when no step is claimable but the workflow is still running.
- `signal` lets callers abort a run through `AbortController`.

## Database Ownership

The package initializes its own internal schema through `ensureWorkflowSchema()` when workflows start or run. Application migrations should model business data, not recreate `faasjs_workflows`, `faasjs_workflow_steps`, or `faasjs_workflow_schema_migrations`.

Use `@faasjs/pg` and PostgreSQL transactions for business tables that steps mutate. Keep workflow metadata small and workflow-scoped; store large, frequently changing, searchable, or audited business state in feature-owned tables.

## Testing

Put workflow tests under the feature or package `__tests__/` directory that owns the workflow definition.

Use PostgreSQL-backed tests for lifecycle behavior:

- definition validation and missing step/schema errors
- root params and metadata parsing
- one-step processing with `runWorkflowStep()`
- full completion or failure with `runWorkflow()`
- metadata replacement and patch updates when handlers mutate workflow metadata
- recovery through `fail(error, { next })`
- fork joins, branch replacement, and failed branch behavior
- lease expiry and concurrent worker claiming when that behavior matters
- `maxSteps`, `timeoutMs`, and abort behavior for full-run loops

Use type tests with `expectTypeOf(...)` or `assertType(...)` when step schemas or metadata schema inference is part of the contract.

## Review Checklist

- workflow definitions have stable `type`, `root`, and step names
- structured step params use `schemas`, and workflow-level context uses `metadataSchema`
- APIs start workflows instead of doing long-running work inline
- workers call `runWorkflowStep()` and understand it processes at most one step
- `runWorkflow()` calls are bounded with `maxSteps`, `timeoutMs`, or `signal` where appropriate
- step handlers are idempotent and do not directly mutate internal workflow tables
- workflow metadata updates use `updateMetadata()` or `patchMetadata()` and remain small, schema-valid, and idempotent
- recoverable failures use `fail(error, { next })` intentionally
- fork branches have self-contained params and clear join behavior
- tests cover PostgreSQL lifecycle behavior and type inference when relevant
