import type { SchemaOutput } from '@faasjs/node-utils'
import { z, type ZodOutput, type ZodType } from '@faasjs/utils'

/**
 * Terminal and active workflow lifecycle states.
 */
export type WorkflowStatus = 'running' | 'completed' | 'failed' | 'cancelled'

/**
 * Persisted step lifecycle states.
 */
export type WorkflowStepStatus = 'runnable' | 'running' | 'waiting' | 'done' | 'failed'

/**
 * A target step to create after the current step.
 */
export type WorkflowStepTarget = {
  /** Step name from the workflow definition. */
  name: string
  /** Params passed to the target step. Defaults to `{}`. */
  params?: unknown
}

/**
 * Context passed to each workflow step handler.
 */
export type WorkflowStepContext<TParams = any> = {
  /** Persisted workflow id. */
  workflowId: string
  /** Workflow type from the definition. */
  workflowType: string
  /** Current step id. */
  stepId: string
  /** Current step name. */
  stepName: string
  /** Params persisted for this step. */
  params: TParams
  /** Persisted current step row. */
  step: WorkflowStepRecord
}

/**
 * Instruction returned by {@link done}.
 */
export type DoneWorkflowInstruction<TData = unknown> = {
  type: 'done'
  hasData: boolean
  data?: TData
}

/**
 * Instruction returned by {@link next}.
 */
export type NextWorkflowInstruction = {
  type: 'next'
  step: WorkflowStepTarget
}

/**
 * Instruction returned by {@link fork}.
 */
export type ForkWorkflowInstruction = {
  type: 'fork'
  children: WorkflowStepTarget[]
}

/**
 * Instruction returned by {@link fail}.
 */
export type FailWorkflowInstruction = {
  type: 'fail'
  error: unknown
  next?: WorkflowStepTarget
}

/**
 * All workflow instructions.
 */
export type WorkflowInstruction =
  | DoneWorkflowInstruction
  | NextWorkflowInstruction
  | ForkWorkflowInstruction
  | FailWorkflowInstruction

/**
 * A workflow step handler.
 */
export type WorkflowStepHandler<TParams = any> = (
  context: WorkflowStepContext<TParams>,
) => WorkflowInstruction | Promise<WorkflowInstruction>

/**
 * Step handler map keyed by step name.
 */
export type WorkflowSteps = Record<string, WorkflowStepHandler<any>>

/**
 * Zod schema map keyed by step name.
 */
export type WorkflowStepSchemas = Record<string, ZodType>

/**
 * Params inferred from a step's Zod schema.
 */
export type WorkflowStepParams<
  TSchemas extends WorkflowStepSchemas | undefined = undefined,
  TName extends string = string,
> = TSchemas extends WorkflowStepSchemas
  ? TName extends keyof TSchemas
    ? SchemaOutput<TSchemas[TName], Record<string, never>>
    : Record<string, never>
  : any

/**
 * Step handlers inferred from a Zod schema map.
 */
export type WorkflowSchemaSteps<TSchemas extends WorkflowStepSchemas> = {
  [TName in Extract<keyof TSchemas, string>]: WorkflowStepHandler<
    WorkflowStepParams<TSchemas, TName>
  >
}

function isWorkflowStepHandler(value: unknown): value is WorkflowStepHandler {
  return typeof value === 'function'
}

function isZodSchema(value: unknown): value is ZodType {
  return Boolean(
    value &&
    typeof value === 'object' &&
    typeof (value as { safeParseAsync?: unknown }).safeParseAsync === 'function',
  )
}

const nonEmptyStringSchema = (message: string) =>
  z.string().refine((value) => value.trim().length > 0, message)

const workflowStepNameSchema = nonEmptyStringSchema('[workflow] step name must not be empty.')

const workflowStepHandlerSchema = z.custom<WorkflowStepHandler>(
  isWorkflowStepHandler,
  '[workflow] step handler must be a function.',
)

const workflowStepSchemaSchema = z.custom<ZodType>(
  isZodSchema,
  '[workflow] step schema must be a Zod schema.',
)

/**
 * Zod schema used to validate {@link defineWorkflow} options.
 */
export const defineWorkflowOptionsSchema = z
  .object({
    type: nonEmptyStringSchema('[workflow] type must not be empty.'),
    root: nonEmptyStringSchema('[workflow] root must not be empty.'),
    steps: z.record(workflowStepNameSchema, workflowStepHandlerSchema),
    schemas: z.record(workflowStepNameSchema, workflowStepSchemaSchema).optional(),
  })
  .superRefine((options, context) => {
    const stepNames = Object.keys(options.steps)

    if (!stepNames.length) {
      context.addIssue({
        code: 'custom',
        path: ['steps'],
        message: '[workflow] steps must not be empty.',
      })
    }

    if (!Object.hasOwn(options.steps, options.root)) {
      context.addIssue({
        code: 'custom',
        path: ['root'],
        message: `[workflow] root step "${options.root}" is missing.`,
      })
    }

    if (!options.schemas) return

    for (const name of stepNames) {
      if (Object.hasOwn(options.schemas, name)) continue

      context.addIssue({
        code: 'custom',
        path: ['schemas', name],
        message: `[workflow] step "${name}" schema is missing.`,
      })
    }

    for (const name of Object.keys(options.schemas)) {
      if (Object.hasOwn(options.steps, name)) continue

      context.addIssue({
        code: 'custom',
        path: ['schemas', name],
        message: `[workflow] schema step "${name}" is missing.`,
      })
    }
  })

/**
 * Base options shape inferred from {@link defineWorkflowOptionsSchema}.
 */
export type DefineWorkflowOptionsInput = ZodOutput<typeof defineWorkflowOptionsSchema>

/**
 * Options for {@link defineWorkflow}.
 */
export type DefineWorkflowOptions<
  TSteps extends WorkflowSteps = WorkflowSteps,
  TRoot extends Extract<keyof TSteps, string> = Extract<keyof TSteps, string>,
  TSchemas extends WorkflowStepSchemas | undefined = undefined,
> = Omit<DefineWorkflowOptionsInput, 'root' | 'steps' | 'schemas'> & {
  /** Root step name. */
  root: TRoot
  /** Step handlers keyed by step name. */
  steps: TSteps
} & (TSchemas extends WorkflowStepSchemas
    ? {
        /** Zod schemas keyed by step name. Each schema validates and types that step's params. */
        schemas: TSchemas
      }
    : {
        /** Zod schemas keyed by step name. Each schema validates and types that step's params. */
        schemas?: undefined
      })

/**
 * Workflow definition returned by {@link defineWorkflow}.
 */
export type WorkflowDefinition<
  TSteps extends WorkflowSteps = WorkflowSteps,
  TRoot extends Extract<keyof TSteps, string> = Extract<keyof TSteps, string>,
  TSchemas extends WorkflowStepSchemas | undefined = WorkflowStepSchemas | undefined,
> = Readonly<{
  /** Business workflow type, for example `agent_workflow`. */
  type: string
  /** Root step name. */
  root: TRoot
  /** Step handlers keyed by step name. */
  steps: TSteps
  /** Zod schemas keyed by step name. */
  schemas?: TSchemas
}>

/**
 * Persisted row from `faasjs_workflows`.
 */
export type WorkflowRecord = {
  id: string
  type: string
  status: WorkflowStatus
  root_step_id: string | null
  version: number
  created_at: Date | string
  updated_at: Date | string
  completed_at: Date | string | null
  failed_at: Date | string | null
  cancelled_at: Date | string | null
}

/**
 * Persisted row from `faasjs_workflow_steps`.
 */
export type WorkflowStepRecord = {
  seq: number | string
  id: string
  workflow_id: string
  workflow_type: string
  name: string
  parent_id: string | null
  params: unknown
  data: unknown
  status: WorkflowStepStatus
  next_step_id: string | null
  fork_child_ids: string[] | null
  locked_by: string | null
  lease_id: string | null
  locked_until: Date | string | null
  error: unknown
  created_at: Date | string
  updated_at: Date | string
}

/**
 * Options for {@link startWorkflow}.
 */
export type StartWorkflowOptions<TParams = unknown> = {
  /** Params passed to the root step. Defaults to `{}`. */
  params?: TParams
}

/**
 * Result returned by {@link startWorkflow}.
 */
export type StartWorkflowResult = {
  workflowId: string
}

/**
 * Options for {@link runWorkflowStep}.
 */
export type RunWorkflowStepOptions = {
  /** Optional workflow id to restrict the claim to one workflow. */
  workflowId?: string
  /** Lease duration in seconds. Defaults to `60`. */
  leaseSeconds?: number
  /** Worker identifier persisted on the claimed step. */
  workerId?: string
}

/**
 * Result returned by {@link runWorkflowStep}.
 */
export type RunWorkflowStepResult = {
  claimed: boolean
  workflowId?: string
  stepId?: string
  workflowStatus?: WorkflowStatus
}

/**
 * Input for {@link runWorkflow}.
 */
export type RunWorkflowInput<TParams = unknown> =
  | {
      /** Params used to create a new workflow. */
      params?: TParams
      workflowId?: never
    }
  | {
      /** Existing workflow id to resume. */
      workflowId: string
      params?: never
    }

/**
 * Options for {@link runWorkflow}.
 */
export type RunWorkflowOptions = Omit<RunWorkflowStepOptions, 'workflowId'> & {
  /** Maximum number of steps to run before throwing. */
  maxSteps?: number
  /** Maximum wall-clock duration in milliseconds before throwing. */
  timeoutMs?: number
  /** Abort signal used to interrupt the loop. */
  signal?: AbortSignal
  /** Delay when no step is claimable but the workflow is still running. Defaults to `100`. */
  pollIntervalMs?: number
}

/**
 * Result returned by {@link runWorkflow}.
 */
export type RunWorkflowResult = {
  workflowId: string
  status: Exclude<WorkflowStatus, 'running'>
  stepsRun: number
}
