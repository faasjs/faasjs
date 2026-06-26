[@faasjs/workflow](../README.md) / fail

# Function: fail()

> **fail**(`error`, `options?`): [`FailWorkflowInstruction`](../type-aliases/FailWorkflowInstruction.md)

Mark the current step as failed. When `options.next` is provided, the workflow
continues with that next step after recording the failure.

## Parameters

### error

`unknown`

Failure reason to persist.

### options?

Optional recoverable-failure continuation.

#### next?

[`WorkflowStepTarget`](../type-aliases/WorkflowStepTarget.md)

## Returns

[`FailWorkflowInstruction`](../type-aliases/FailWorkflowInstruction.md)
