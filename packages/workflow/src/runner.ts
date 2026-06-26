import { randomUUID } from 'node:crypto'

import { parseSchemaValue } from '@faasjs/node-utils'
import { getClient, type Client } from '@faasjs/pg'

import { fail } from './instructions'
import { ensureWorkflowSchema } from './schema'
import type {
  FailWorkflowInstruction,
  ForkWorkflowInstruction,
  NextWorkflowInstruction,
  RunWorkflowInput,
  RunWorkflowOptions,
  RunWorkflowResult,
  RunWorkflowStepOptions,
  RunWorkflowStepResult,
  StartWorkflowOptions,
  StartWorkflowResult,
  WorkflowDefinition,
  WorkflowInstruction,
  WorkflowRecord,
  WorkflowStatus,
  WorkflowStepRecord,
  WorkflowStepParams,
  WorkflowStepSchemas,
  WorkflowStepTarget,
  WorkflowSteps,
} from './types'

const DEFAULT_LEASE_SECONDS = 60
const DEFAULT_POLL_INTERVAL_MS = 100

type WorkflowError = {
  name?: string
  message: string
  stack?: string
}

function resolvePositiveInteger(
  value: number | undefined,
  defaultValue: number,
  name: string,
): number {
  if (value === undefined) return defaultValue

  if (!Number.isInteger(value) || value <= 0) {
    throw Error(`[workflow] ${name} must be a positive integer.`)
  }

  return value
}

function resolveNonNegativeInteger(
  value: number | undefined,
  defaultValue: number,
  name: string,
): number {
  if (value === undefined) return defaultValue

  if (!Number.isInteger(value) || value < 0) {
    throw Error(`[workflow] ${name} must be a non-negative integer.`)
  }

  return value
}

function resolveWorkerId(workerId: string | undefined): string {
  if (workerId === undefined) return `workflow-worker-${randomUUID()}`

  if (typeof workerId !== 'string' || !workerId.trim()) {
    throw Error('[workflow] workerId must not be empty.')
  }

  return workerId
}

function normalizeJsonValue(value: unknown): unknown {
  return value === undefined ? null : value
}

function normalizeParams(params: unknown): unknown {
  return params === undefined ? {} : params
}

async function parseWorkflowStepParams(
  workflow: WorkflowDefinition,
  name: string,
  params: unknown,
): Promise<unknown> {
  const schema = workflow.schemas?.[name]

  if (!schema) return normalizeParams(params)

  return parseSchemaValue({
    schema,
    value: params,
    errorMessage: `Invalid workflow step "${name}" params`,
  })
}

function normalizeError(error: unknown): WorkflowError {
  if (error instanceof Error) {
    const normalized: WorkflowError = {
      name: error.name,
      message: error.message,
    }

    if (error.stack) normalized.stack = error.stack

    return normalized
  }

  return {
    message: String(error),
  }
}

function assertStepTarget(workflow: WorkflowDefinition, target: WorkflowStepTarget): void {
  if (!target || typeof target !== 'object') {
    throw Error('[workflow] step target must be an object.')
  }

  if (typeof target.name !== 'string' || !target.name.trim()) {
    throw Error('[workflow] step name must not be empty.')
  }

  if (typeof workflow.steps[target.name] !== 'function') {
    throw Error(
      `[workflow] Missing step handler "${target.name}" for workflow type "${workflow.type}".`,
    )
  }
}

function assertInstruction(
  workflow: WorkflowDefinition,
  instruction: WorkflowInstruction,
): WorkflowInstruction {
  if (!instruction || typeof instruction !== 'object') {
    throw Error('[workflow] step handler must return a workflow instruction.')
  }

  switch (instruction.type) {
    case 'done':
      return instruction
    case 'next':
      assertStepTarget(workflow, instruction.step)
      return instruction
    case 'fork':
      if (!Array.isArray(instruction.children) || instruction.children.length === 0) {
        throw Error('[workflow] fork children must not be empty.')
      }

      for (const child of instruction.children) assertStepTarget(workflow, child)

      return instruction
    case 'fail':
      if (instruction.next) assertStepTarget(workflow, instruction.next)

      return instruction
    default:
      throw Error('[workflow] step handler returned an unknown instruction.')
  }
}

async function parseWorkflowStepTarget(
  workflow: WorkflowDefinition,
  target: WorkflowStepTarget,
): Promise<WorkflowStepTarget> {
  assertStepTarget(workflow, target)

  const schema = workflow.schemas?.[target.name]

  if (!schema) return target

  return {
    name: target.name,
    params: await parseWorkflowStepParams(workflow, target.name, target.params),
  }
}

async function parseInstructionStepParams(
  workflow: WorkflowDefinition,
  instruction: WorkflowInstruction,
): Promise<WorkflowInstruction> {
  switch (instruction.type) {
    case 'done':
      return instruction
    case 'next':
      return {
        ...instruction,
        step: await parseWorkflowStepTarget(workflow, instruction.step),
      }
    case 'fork':
      return {
        ...instruction,
        children: await Promise.all(
          instruction.children.map((child) => parseWorkflowStepTarget(workflow, child)),
        ),
      }
    case 'fail':
      return instruction.next
        ? {
            ...instruction,
            next: await parseWorkflowStepTarget(workflow, instruction.next),
          }
        : instruction
  }
}

async function getWorkflowStatus(
  client: Client,
  workflow: WorkflowDefinition,
  workflowId: string,
): Promise<WorkflowStatus> {
  const [record] = await client.raw<Pick<WorkflowRecord, 'status'>>(
    'SELECT status FROM faasjs_workflows WHERE id = ?::uuid AND type = ?',
    workflowId,
    workflow.type,
  )

  if (!record) {
    throw Error(`[workflow] Workflow "${workflowId}" of type "${workflow.type}" was not found.`)
  }

  return record.status
}

async function insertStep(
  client: Client,
  workflowId: string,
  workflow: WorkflowDefinition,
  target: WorkflowStepTarget,
  parentId: string | null,
): Promise<string> {
  const id = randomUUID()

  await client.raw(
    `
      INSERT INTO faasjs_workflow_steps (
        id, workflow_id, workflow_type, name, parent_id, params, status
      )
      VALUES (?::uuid, ?::uuid, ?, ?, ?::uuid, ?::jsonb, 'runnable')
    `,
    id,
    workflowId,
    workflow.type,
    target.name,
    parentId,
    normalizeParams(target.params),
  )

  return id
}

async function replaceBranchHead(
  client: Client,
  step: WorkflowStepRecord,
  nextStepId: string,
): Promise<void> {
  if (!step.parent_id) return

  await client.raw(
    `
      UPDATE faasjs_workflow_steps
      SET
        fork_child_ids = array_replace(fork_child_ids, ?::uuid, ?::uuid),
        updated_at = NOW()
      WHERE id = ?::uuid
        AND workflow_id = ?::uuid
    `,
    step.id,
    nextStepId,
    step.parent_id,
    step.workflow_id,
  )
}

async function finishWorkflow(
  client: Client,
  workflowId: string,
  status: Exclude<WorkflowStatus, 'running'>,
): Promise<void> {
  const completedAt = status === 'completed' ? 'NOW()' : 'completed_at'
  const failedAt = status === 'failed' ? 'NOW()' : 'failed_at'
  const cancelledAt = status === 'cancelled' ? 'NOW()' : 'cancelled_at'

  await client.raw(
    `
      UPDATE faasjs_workflows
      SET
        status = ?,
        version = version + 1,
        updated_at = NOW(),
        completed_at = ${completedAt},
        failed_at = ${failedAt},
        cancelled_at = ${cancelledAt}
      WHERE id = ?::uuid
        AND status = 'running'
    `,
    status,
    workflowId,
  )
}

async function resolveTerminalStep(client: Client, stepId: string): Promise<void> {
  const [step] = await client.raw<WorkflowStepRecord>(
    'SELECT * FROM faasjs_workflow_steps WHERE id = ?::uuid FOR UPDATE',
    stepId,
  )

  if (!step || step.next_step_id) return
  if (step.status !== 'done' && step.status !== 'failed') return

  if (step.parent_id) {
    await resolveForkParent(client, step.parent_id)
    return
  }

  if (step.status === 'done') {
    await finishWorkflow(client, step.workflow_id, 'completed')
    return
  }

  await finishWorkflow(client, step.workflow_id, 'failed')
}

async function resolveForkParent(client: Client, parentId: string): Promise<void> {
  const [parent] = await client.raw<WorkflowStepRecord>(
    'SELECT * FROM faasjs_workflow_steps WHERE id = ?::uuid FOR UPDATE',
    parentId,
  )

  if (!parent || parent.status !== 'waiting' || !parent.fork_child_ids?.length) return

  const childIds = parent.fork_child_ids
  const children = await client.raw<WorkflowStepRecord>(
    `
      SELECT *
      FROM faasjs_workflow_steps
      WHERE id = ANY(?::uuid[])
      ORDER BY array_position(?::uuid[], id)
    `,
    childIds,
    childIds,
  )

  if (children.length !== childIds.length) return
  if (children.some((child) => child.status !== 'done' && child.status !== 'failed')) return

  const failedChildren = children.filter(
    (child) => child.status === 'failed' && !child.next_step_id,
  )

  if (failedChildren.length) {
    await client.raw(
      `
        UPDATE faasjs_workflow_steps
        SET
          status = 'failed',
          error = ?::jsonb,
          updated_at = NOW()
        WHERE id = ?::uuid
      `,
      {
        message: 'Fork branch failed.',
        failedStepIds: failedChildren.map((child) => child.id),
      },
      parent.id,
    )
  } else {
    await client.raw(
      `
        UPDATE faasjs_workflow_steps
        SET
          status = 'done',
          updated_at = NOW()
        WHERE id = ?::uuid
      `,
      parent.id,
    )
  }

  await resolveTerminalStep(client, parent.id)
}

async function claimWorkflowStep(
  client: Client,
  workflow: WorkflowDefinition,
  options: Required<Pick<RunWorkflowStepOptions, 'leaseSeconds' | 'workerId'>> &
    Pick<RunWorkflowStepOptions, 'workflowId'>,
): Promise<WorkflowStepRecord | undefined> {
  const leaseId = randomUUID()
  const workflowId = options.workflowId ?? null
  const [record] = await client.transaction((trx) =>
    trx.raw<WorkflowStepRecord>(
      `
        WITH picked AS (
          SELECT s.id
          FROM faasjs_workflow_steps s
          INNER JOIN faasjs_workflows w
            ON w.id = s.workflow_id
           AND w.type = s.workflow_type
          WHERE s.workflow_type = ?
            AND (?::uuid IS NULL OR s.workflow_id = ?::uuid)
            AND w.status = 'running'
            AND (
              s.status = 'runnable'
              OR (s.status = 'running' AND s.locked_until < NOW())
            )
          ORDER BY s.seq ASC
          FOR UPDATE SKIP LOCKED
          LIMIT 1
        )
        UPDATE faasjs_workflow_steps s
        SET
          status = 'running',
          locked_by = ?,
          lease_id = ?::uuid,
          locked_until = NOW() + ?::interval,
          updated_at = NOW()
        WHERE s.id IN (SELECT id FROM picked)
        RETURNING s.*
      `,
      workflow.type,
      workflowId,
      workflowId,
      options.workerId,
      leaseId,
      `${options.leaseSeconds} seconds`,
    ),
  )

  return record
}

async function commitDoneInstruction(
  client: Client,
  step: WorkflowStepRecord,
  instruction: WorkflowInstruction & {
    type: 'done'
  },
): Promise<void> {
  if (instruction.hasData) {
    await client.raw(
      `
        UPDATE faasjs_workflow_steps
        SET
          status = 'done',
          data = ?::jsonb,
          locked_by = NULL,
          lease_id = NULL,
          locked_until = NULL,
          updated_at = NOW()
        WHERE id = ?::uuid
          AND lease_id = ?::uuid
      `,
      normalizeJsonValue(instruction.data),
      step.id,
      step.lease_id,
    )
  } else {
    await client.raw(
      `
        UPDATE faasjs_workflow_steps
        SET
          status = 'done',
          locked_by = NULL,
          lease_id = NULL,
          locked_until = NULL,
          updated_at = NOW()
        WHERE id = ?::uuid
          AND lease_id = ?::uuid
      `,
      step.id,
      step.lease_id,
    )
  }

  await resolveTerminalStep(client, step.id)
}

async function commitNextInstruction(
  client: Client,
  workflow: WorkflowDefinition,
  step: WorkflowStepRecord,
  instruction: NextWorkflowInstruction,
): Promise<void> {
  const nextStepId = await insertStep(
    client,
    step.workflow_id,
    workflow,
    instruction.step,
    step.parent_id,
  )

  await client.raw(
    `
      UPDATE faasjs_workflow_steps
      SET
        status = 'done',
        next_step_id = ?::uuid,
        locked_by = NULL,
        lease_id = NULL,
        locked_until = NULL,
        updated_at = NOW()
      WHERE id = ?::uuid
        AND lease_id = ?::uuid
    `,
    nextStepId,
    step.id,
    step.lease_id,
  )

  await replaceBranchHead(client, step, nextStepId)
}

async function commitFailInstruction(
  client: Client,
  workflow: WorkflowDefinition,
  step: WorkflowStepRecord,
  instruction: FailWorkflowInstruction,
): Promise<void> {
  const error = normalizeError(instruction.error)

  if (instruction.next) {
    const nextStepId = await insertStep(
      client,
      step.workflow_id,
      workflow,
      instruction.next,
      step.parent_id,
    )

    await client.raw(
      `
        UPDATE faasjs_workflow_steps
        SET
          status = 'failed',
          next_step_id = ?::uuid,
          error = ?::jsonb,
          locked_by = NULL,
          lease_id = NULL,
          locked_until = NULL,
          updated_at = NOW()
        WHERE id = ?::uuid
          AND lease_id = ?::uuid
      `,
      nextStepId,
      error,
      step.id,
      step.lease_id,
    )

    await replaceBranchHead(client, step, nextStepId)
    return
  }

  await client.raw(
    `
      UPDATE faasjs_workflow_steps
      SET
        status = 'failed',
        error = ?::jsonb,
        locked_by = NULL,
        lease_id = NULL,
        locked_until = NULL,
        updated_at = NOW()
      WHERE id = ?::uuid
        AND lease_id = ?::uuid
    `,
    error,
    step.id,
    step.lease_id,
  )

  await resolveTerminalStep(client, step.id)
}

async function commitForkInstruction(
  client: Client,
  workflow: WorkflowDefinition,
  step: WorkflowStepRecord,
  instruction: ForkWorkflowInstruction,
): Promise<void> {
  const childIds: string[] = []

  for (const child of instruction.children) {
    childIds.push(await insertStep(client, step.workflow_id, workflow, child, step.id))
  }

  await client.raw(
    `
      UPDATE faasjs_workflow_steps
      SET
        status = 'waiting',
        fork_child_ids = ?::uuid[],
        locked_by = NULL,
        lease_id = NULL,
        locked_until = NULL,
        updated_at = NOW()
      WHERE id = ?::uuid
        AND lease_id = ?::uuid
    `,
    childIds,
    step.id,
    step.lease_id,
  )
}

async function commitInstruction(
  client: Client,
  workflow: WorkflowDefinition,
  claimedStep: WorkflowStepRecord,
  instruction: WorkflowInstruction,
): Promise<WorkflowStatus> {
  return client.transaction(async (trx) => {
    const [step] = await trx.raw<WorkflowStepRecord>(
      `
        SELECT *
        FROM faasjs_workflow_steps
        WHERE id = ?::uuid
          AND lease_id = ?::uuid
        FOR UPDATE
      `,
      claimedStep.id,
      claimedStep.lease_id,
    )

    if (!step) return getWorkflowStatus(trx, workflow, claimedStep.workflow_id)

    switch (instruction.type) {
      case 'done':
        await commitDoneInstruction(trx, step, instruction)
        break
      case 'next':
        await commitNextInstruction(trx, workflow, step, instruction)
        break
      case 'fork':
        await commitForkInstruction(trx, workflow, step, instruction)
        break
      case 'fail':
        await commitFailInstruction(trx, workflow, step, instruction)
        break
    }

    return getWorkflowStatus(trx, workflow, claimedStep.workflow_id)
  })
}

async function assertWorkflowCanRun(
  client: Client,
  workflow: WorkflowDefinition,
  workflowId: string,
): Promise<WorkflowStatus> {
  return getWorkflowStatus(client, workflow, workflowId)
}

function throwIfAborted(signal: AbortSignal | undefined): void {
  if (signal?.aborted) throw signal.reason || Error('[workflow] runWorkflow aborted.')
}

async function sleep(ms: number, signal: AbortSignal | undefined): Promise<void> {
  throwIfAborted(signal)

  if (ms <= 0) return

  await new Promise<void>((resolve, reject) => {
    const cleanup = () => signal?.removeEventListener('abort', abort)
    const finish = () => {
      cleanup()
      resolve()
    }
    const abort = () => {
      clearTimeout(timeout)
      cleanup()
      reject(signal?.reason || Error('[workflow] runWorkflow aborted.'))
    }
    const timeout = setTimeout(finish, ms)

    signal?.addEventListener('abort', abort, {
      once: true,
    })
  })
}

/**
 * Create a workflow row and its root runnable step.
 *
 * @param workflow - Workflow definition.
 * @param options - Root step params.
 *
 * @example
 * ```ts
 * import { startWorkflow } from '@faasjs/workflow'
 *
 * import { orderWorkflow } from './workflows/order'
 *
 * const { workflowId } = await startWorkflow(orderWorkflow, {
 *   params: {
 *     orderId: 'order_001',
 *   },
 * })
 *
 * console.log(`Started workflow ${workflowId}`)
 * ```
 */
export async function startWorkflow<
  TSteps extends WorkflowSteps,
  TRoot extends Extract<keyof TSteps, string>,
  TSchemas extends WorkflowStepSchemas | undefined = undefined,
>(
  workflow: WorkflowDefinition<TSteps, TRoot, TSchemas>,
  options: StartWorkflowOptions<WorkflowStepParams<TSchemas, TRoot>> = {},
): Promise<StartWorkflowResult> {
  const rootTarget = await parseWorkflowStepTarget(workflow, {
    name: workflow.root,
    params: options.params,
  })

  const client = await getClient()

  await ensureWorkflowSchema(client)

  const workflowId = randomUUID()
  const rootStepId = randomUUID()

  await client.transaction(async (trx) => {
    await trx.raw(
      `
        INSERT INTO faasjs_workflows (id, type, status)
        VALUES (?::uuid, ?, 'running')
      `,
      workflowId,
      workflow.type,
    )

    await trx.raw(
      `
        INSERT INTO faasjs_workflow_steps (
          id, workflow_id, workflow_type, name, parent_id, params, status
        )
        VALUES (?::uuid, ?::uuid, ?, ?, NULL, ?::jsonb, 'runnable')
      `,
      rootStepId,
      workflowId,
      workflow.type,
      workflow.root,
      normalizeParams(rootTarget.params),
    )

    await trx.raw(
      `
        UPDATE faasjs_workflows
        SET
          root_step_id = ?::uuid,
          version = version + 1,
          updated_at = NOW()
        WHERE id = ?::uuid
      `,
      rootStepId,
      workflowId,
    )
  })

  return {
    workflowId,
  }
}

/**
 * Claim and execute at most one runnable step for a workflow definition.
 *
 * @param workflow - Workflow definition.
 * @param options - Optional claim restrictions and lease settings.
 *
 * @example
 * ```ts
 * import { defineJob } from '@faasjs/jobs'
 * import { runWorkflowStep } from '@faasjs/workflow'
 *
 * import { orderWorkflow } from '../workflows/order'
 *
 * export default defineJob({
 *   async handler() {
 *     const result = await runWorkflowStep(orderWorkflow, {
 *       workerId: 'order-worker',
 *       leaseSeconds: 60,
 *     })
 *
 *     if (!result.claimed) return
 *
 *     console.log(`Ran step ${result.stepId} for workflow ${result.workflowId}`)
 *   },
 * })
 * ```
 */
export async function runWorkflowStep(
  workflow: WorkflowDefinition,
  options: RunWorkflowStepOptions = {},
): Promise<RunWorkflowStepResult> {
  const client = await getClient()

  await ensureWorkflowSchema(client)

  if (options.workflowId !== undefined && !options.workflowId.trim()) {
    throw Error('[workflow] workflowId must not be empty.')
  }

  const resolvedOptions: Required<Pick<RunWorkflowStepOptions, 'leaseSeconds' | 'workerId'>> &
    Pick<RunWorkflowStepOptions, 'workflowId'> = {
    leaseSeconds: resolvePositiveInteger(
      options.leaseSeconds,
      DEFAULT_LEASE_SECONDS,
      'leaseSeconds',
    ),
    workerId: resolveWorkerId(options.workerId),
  }

  if (options.workflowId !== undefined) {
    resolvedOptions.workflowId = options.workflowId
    await assertWorkflowCanRun(client, workflow, options.workflowId)
  }

  const record = await claimWorkflowStep(client, workflow, resolvedOptions)

  if (!record) {
    const result: RunWorkflowStepResult = {
      claimed: false,
    }

    if (resolvedOptions.workflowId) {
      result.workflowId = resolvedOptions.workflowId
      result.workflowStatus = await getWorkflowStatus(client, workflow, resolvedOptions.workflowId)
    }

    return result
  }

  const handler = workflow.steps[record.name]
  let instruction: WorkflowInstruction

  try {
    if (!handler) {
      throw Error(
        `[workflow] Missing step handler "${record.name}" for workflow type "${workflow.type}".`,
      )
    }

    instruction = await parseInstructionStepParams(
      workflow,
      assertInstruction(
        workflow,
        await handler({
          workflowId: record.workflow_id,
          workflowType: record.workflow_type,
          stepId: record.id,
          stepName: record.name,
          params: await parseWorkflowStepParams(workflow, record.name, record.params),
          step: record,
        }),
      ),
    )
  } catch (error) {
    instruction = fail(error)
  }

  const workflowStatus = await commitInstruction(client, workflow, record, instruction)

  return {
    claimed: true,
    workflowId: record.workflow_id,
    stepId: record.id,
    workflowStatus,
  }
}

/**
 * Run a workflow until it completes, fails, or is cancelled.
 *
 * @param workflow - Workflow definition.
 * @param input - Params for a new workflow or workflow id to resume.
 * @param options - Loop limits and lease settings.
 *
 * @example
 * ```ts
 * import { runWorkflow } from '@faasjs/workflow'
 *
 * import { orderWorkflow } from './workflows/order'
 *
 * const result = await runWorkflow(
 *   orderWorkflow,
 *   {
 *     params: {
 *       orderId: 'order_001',
 *     },
 *   },
 *   {
 *     maxSteps: 20,
 *     timeoutMs: 30_000,
 *   },
 * )
 *
 * console.log(`Workflow ${result.workflowId} finished as ${result.status}`)
 * ```
 */
export async function runWorkflow<
  TSteps extends WorkflowSteps,
  TRoot extends Extract<keyof TSteps, string>,
  TSchemas extends WorkflowStepSchemas | undefined = undefined,
>(
  workflow: WorkflowDefinition<TSteps, TRoot, TSchemas>,
  input: RunWorkflowInput<WorkflowStepParams<TSchemas, TRoot>>,
  options: RunWorkflowOptions = {},
): Promise<RunWorkflowResult> {
  const client = await getClient()

  await ensureWorkflowSchema(client)

  const startOptions: StartWorkflowOptions<WorkflowStepParams<TSchemas, TRoot>> = {}

  if ('params' in input && input.params !== undefined) {
    startOptions.params = input.params
  }

  const workflowId =
    'workflowId' in input
      ? input.workflowId
      : (await startWorkflow(workflow, startOptions)).workflowId

  if (typeof workflowId !== 'string' || !workflowId.trim()) {
    throw Error('[workflow] workflowId must not be empty.')
  }

  let status = await getWorkflowStatus(client, workflow, workflowId)
  let stepsRun = 0
  const startedAt = Date.now()
  const pollIntervalMs = resolveNonNegativeInteger(
    options.pollIntervalMs,
    DEFAULT_POLL_INTERVAL_MS,
    'pollIntervalMs',
  )

  while (status === 'running') {
    throwIfAborted(options.signal)

    if (options.timeoutMs !== undefined && Date.now() - startedAt >= options.timeoutMs) {
      throw Error('[workflow] runWorkflow timeout exceeded.')
    }

    if (options.maxSteps !== undefined && stepsRun >= options.maxSteps) {
      throw Error('[workflow] runWorkflow maxSteps exceeded.')
    }

    const stepOptions: RunWorkflowStepOptions = {
      workflowId,
    }

    if (options.leaseSeconds !== undefined) stepOptions.leaseSeconds = options.leaseSeconds
    if (options.workerId !== undefined) stepOptions.workerId = options.workerId

    const result = await runWorkflowStep(workflow, stepOptions)

    if (result.claimed) stepsRun += 1

    status = result.workflowStatus ?? (await getWorkflowStatus(client, workflow, workflowId))

    if (status === 'running' && !result.claimed) {
      await sleep(pollIntervalMs, options.signal)
    }
  }

  return {
    workflowId,
    status,
    stepsRun,
  }
}
