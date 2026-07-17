# PG Transactions and Locking Guide

Use this guide when atomicity, isolation levels, read-only transactions, row locks, competing workers, deadlocks, or serialization failures matter.

## Transaction Workflow

1. Put every read and write that must commit together inside one `client.transaction(...)` callback.
2. Use only the callback's `trx` client inside that unit of work.
3. Choose explicit transaction options only when the workflow depends on PostgreSQL semantics.
4. Keep row locks in that explicit transaction and make wait behavior intentional.
5. Let errors escape the callback so PostgreSQL rolls back the whole transaction.
6. Add bounded retry logic outside the transaction only when the business operation is safe to replay.

```ts
const result = await client.transaction(
  { isolation: 'repeatable read', readOnly: false },
  async (trx) => {
    const job = await trx
      .query('jobs')
      .where('status', 'pending')
      .orderBy('id')
      .forUpdate({ skipLocked: true })
      .first()

    if (!job) return null

    await trx.query('jobs').where('id', job.id).update({ status: 'running' })
    return job
  },
)
```

## Transaction Options

Supported isolation values are:

- `read uncommitted`
- `read committed`
- `repeatable read`
- `serializable`

PostgreSQL treats `read uncommitted` as `read committed`. Use `readOnly: true` to request `READ ONLY` and `readOnly: false` for explicit `READ WRITE`; omit it to use the database default.

The transaction-scoped client is valid only during the callback. Do not return it, assign it to module state, capture it for later work, or pass it to a job handler that runs after commit.

FaasJS does not automatically retry serialization failures, deadlocks, or lock errors. If the application retries SQLSTATE `40001` or `40P01`, replay the complete transaction callback from the beginning, use a strict attempt limit and backoff, and ensure external side effects are outside the replayable unit or independently idempotent.

## Row Locking Rules

`forUpdate()` emits `SELECT ... FOR UPDATE` and holds locks until the surrounding transaction ends.

- Use `skipLocked: true` for competing consumers that should move to another row.
- Use `noWait: true` when lock contention must fail immediately.
- Never combine `skipLocked` and `noWait`.
- Use `of` only with known tables or aliases from the query. Values are escaped as identifiers but are not constrained to declared table types.
- Do not call `forUpdate().count()`; count queries reject row locking.
- Keep selection order deterministic before `limit(1)` so competing workers agree on claim priority.

Do not use a row lock outside an explicit transaction: an implicit statement transaction releases it before the protected read-write workflow completes.

## Transaction-coupled Jobs

When a business write and `enqueueJob()` must commit atomically, pass `{ client: trx }` to the enqueue call. Load the Jobs Guide for the full workflow.

The enqueue insert participates in the surrounding transaction; it does not keep the transaction client for later worker execution. Rollback tests must assert that neither the business write nor the job row committed.

## Concurrency Tests

Use real PostgreSQL transactions for lock contention rather than asserting only generated SQL. PGlite remains useful for single-transaction commit and rollback tests, but do not assume it reproduces multi-connection lock scheduling:

- open independent transaction callbacks that can overlap
- coordinate them with explicit promises or barriers instead of sleeps
- force one transaction to hold the target row while another exercises `skipLocked`, `noWait`, or blocking behavior
- assert committed database state after both transactions settle
- reject a transaction after its writes and assert every write rolled back
- for retry code, force the retryable error and assert the whole unit replays no more than the configured limit

## Review Checklist

- every atomic read-write flow uses one transaction-scoped client
- transaction clients do not escape their callbacks
- explicit isolation and read-only modes are justified by the workflow
- lock wait behavior and row ordering are intentional
- `forUpdate()` stays inside a transaction and is not combined with `count()`
- retry logic is bounded, replays the complete unit, and avoids duplicate external side effects
- concurrency tests use overlapping transactions and assert final persisted state
