import type {
  DoneWorkflowInstruction,
  FailWorkflowInstruction,
  ForkWorkflowInstruction,
  NextWorkflowInstruction,
  WorkflowStepTarget,
} from './types'

function assertStepName(name: string): void {
  if (typeof name !== 'string' || !name.trim()) {
    throw Error('[workflow] step name must not be empty.')
  }
}

function createStepTarget(name: string, params?: unknown): WorkflowStepTarget {
  assertStepName(name)

  return arguments.length > 1
    ? {
        name,
        params,
      }
    : {
        name,
      }
}

/**
 * Mark the current step as done.
 *
 * @param data - Optional JSON-serializable data to persist on the step.
 */
export function done<TData = unknown>(data?: TData): DoneWorkflowInstruction<TData> {
  const instruction: DoneWorkflowInstruction<TData> = {
    type: 'done',
    hasData: arguments.length > 0,
  }

  if (arguments.length > 0) instruction.data = data as TData

  return instruction
}

/**
 * Mark the current step as done and create a next runnable step.
 *
 * @param name - Target step name.
 * @param params - Params passed to the target step.
 */
export function next(name: string, params?: unknown): NextWorkflowInstruction {
  return {
    type: 'next',
    step: createStepTarget(name, params),
  }
}

/**
 * Mark the current step as waiting and create parallel child branch steps.
 *
 * @param children - Child steps to create.
 */
export function fork(children: WorkflowStepTarget[]): ForkWorkflowInstruction {
  if (!Array.isArray(children) || children.length === 0) {
    throw Error('[workflow] fork children must not be empty.')
  }

  return {
    type: 'fork',
    children: children.map((child) => createStepTarget(child.name, child.params)),
  }
}

/**
 * Mark the current step as failed. When `options.next` is provided, the workflow
 * continues with that next step after recording the failure.
 *
 * @param error - Failure reason to persist.
 * @param options - Optional recoverable-failure continuation.
 */
export function fail(
  error: unknown,
  options?: {
    next?: WorkflowStepTarget
  },
): FailWorkflowInstruction {
  const instruction: FailWorkflowInstruction = {
    type: 'fail',
    error,
  }

  if (options?.next) instruction.next = createStepTarget(options.next.name, options.next.params)

  return instruction
}
