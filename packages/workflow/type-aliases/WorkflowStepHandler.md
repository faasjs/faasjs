[@faasjs/workflow](../README.md) / WorkflowStepHandler

# Type Alias: WorkflowStepHandler\<TParams\>

> **WorkflowStepHandler**\<`TParams`\> = (`context`) => [`WorkflowInstruction`](WorkflowInstruction.md) \| `Promise`\<[`WorkflowInstruction`](WorkflowInstruction.md)\>

A workflow step handler.

## Type Parameters

### TParams

`TParams` = `any`

## Parameters

### context

[`WorkflowStepContext`](WorkflowStepContext.md)\<`TParams`\>

## Returns

[`WorkflowInstruction`](WorkflowInstruction.md) \| `Promise`\<[`WorkflowInstruction`](WorkflowInstruction.md)\>
