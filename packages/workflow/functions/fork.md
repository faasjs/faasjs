[@faasjs/workflow](../README.md) / fork

# Function: fork()

> **fork**(`children`): [`ForkWorkflowInstruction`](../type-aliases/ForkWorkflowInstruction.md)

Mark the current step as waiting and create parallel child branch steps.

## Parameters

### children

[`WorkflowStepTarget`](../type-aliases/WorkflowStepTarget.md)[]

Child steps to create.

## Returns

[`ForkWorkflowInstruction`](../type-aliases/ForkWorkflowInstruction.md)
