[@faasjs/workflow](../README.md) / runWorkflowStep

# Function: runWorkflowStep()

> **runWorkflowStep**(`workflow`, `options?`): `Promise`\<[`RunWorkflowStepResult`](../type-aliases/RunWorkflowStepResult.md)\>

Claim and execute at most one runnable step for a workflow definition.

## Parameters

### workflow

[`WorkflowDefinition`](../type-aliases/WorkflowDefinition.md)

Workflow definition.

### options?

[`RunWorkflowStepOptions`](../type-aliases/RunWorkflowStepOptions.md) = `{}`

Optional claim restrictions and lease settings.

## Returns

`Promise`\<[`RunWorkflowStepResult`](../type-aliases/RunWorkflowStepResult.md)\>
