[@faasjs/workflow](../README.md) / runWorkflow

# Function: runWorkflow()

> **runWorkflow**(`workflow`, `input`, `options?`): `Promise`\<[`RunWorkflowResult`](../type-aliases/RunWorkflowResult.md)\>

Run a workflow until it completes, fails, or is cancelled.

## Parameters

### workflow

[`WorkflowDefinition`](../type-aliases/WorkflowDefinition.md)

Workflow definition.

### input

[`RunWorkflowInput`](../type-aliases/RunWorkflowInput.md)

Params for a new workflow or workflow id to resume.

### options?

[`RunWorkflowOptions`](../type-aliases/RunWorkflowOptions.md) = `{}`

Loop limits and lease settings.

## Returns

`Promise`\<[`RunWorkflowResult`](../type-aliases/RunWorkflowResult.md)\>
