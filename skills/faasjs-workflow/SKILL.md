---
name: faasjs-workflow
description: 'Use when building or reviewing @faasjs/workflow persistent workflows: defineWorkflow, startWorkflow, runWorkflowStep, runWorkflow, done, next, fork, fail, workflow metadata, step schemas, leases, worker IDs, recoverable failures, fork branches, workflow tests, and PostgreSQL-backed workflow lifecycle behavior.'
---

# FaasJS Workflow

## Default Workflow

1. Model long-running business processes as explicit `defineWorkflow(...)` definitions with stable `type`, `root`, and named steps.
2. Use `schemas` for step params and `metadataSchema` for workflow-level context whenever the shape is known.
3. Start durable runs with `startWorkflow()` and execute them from workers with `runWorkflowStep()`.
4. Use `runWorkflow()` for bounded local execution, tests, scripts, or controlled resume flows.
5. Keep step handlers idempotent and return workflow instructions instead of mutating workflow rows directly.

## Load These References

- Workflow definitions, step schemas, metadata, execution modes, recovery, leases, fork branches, and workflow tests: `references/guidelines/workflow.md`.

## Gotchas

- `runWorkflowStep()` claims and executes at most one step per call; schedule it from jobs or worker processes for durable background execution.
- A thrown step handler error is recorded as a failed step. Use `fail(error, { next })` only when the failure has an explicit recovery path.
- Step execution is at-least-once after crashes, lease expiry, or worker overlap; external side effects need idempotency.
- The package owns `faasjs_workflows`, `faasjs_workflow_steps`, and workflow schema migration tables.

## Validation

- Run focused workflow tests with `vp test <pattern>`.
- Include PostgreSQL-backed lifecycle tests when claiming, leases, fork joins, or recovery behavior matters.
- Include type tests when `schemas` or `metadataSchema` inference is part of the behavior.
