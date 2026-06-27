[@faasjs/workflow](../README.md) / WorkflowStepContext

# Type Alias: WorkflowStepContext\<TParams, TMetadata\>

> **WorkflowStepContext**\<`TParams`, `TMetadata`\> = `object`

Context passed to each workflow step handler.

## Type Parameters

### TParams

`TParams` = `any`

### TMetadata

`TMetadata` = `any`

## Properties

### metadata

> **metadata**: `TMetadata`

Metadata persisted on the workflow.

### params

> **params**: `TParams`

Params persisted for this step.

### step

> **step**: [`WorkflowStepRecord`](WorkflowStepRecord.md)

Persisted current step row.

### stepId

> **stepId**: `string`

Current step id.

### stepName

> **stepName**: `string`

Current step name.

### workflowId

> **workflowId**: `string`

Persisted workflow id.

### workflowType

> **workflowType**: `string`

Workflow type from the definition.
