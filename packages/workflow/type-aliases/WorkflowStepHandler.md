[@faasjs/workflow](../README.md) / WorkflowStepHandler

# Type Alias: WorkflowStepHandler\<TParams, TMetadata\>

> **WorkflowStepHandler**\<`TParams`, `TMetadata`\> = (`context`) => [`WorkflowInstruction`](WorkflowInstruction.md) \| `Promise`\<[`WorkflowInstruction`](WorkflowInstruction.md)\>

A workflow step handler.

## Type Parameters

### TParams

`TParams` = `any`

### TMetadata

`TMetadata` = `any`

## Parameters

### context

[`WorkflowStepContext`](WorkflowStepContext.md)\<`TParams`, `TMetadata`\>

## Returns

[`WorkflowInstruction`](WorkflowInstruction.md) \| `Promise`\<[`WorkflowInstruction`](WorkflowInstruction.md)\>
