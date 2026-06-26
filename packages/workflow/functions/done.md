[@faasjs/workflow](../README.md) / done

# Function: done()

> **done**\<`TData`\>(`data?`): [`DoneWorkflowInstruction`](../type-aliases/DoneWorkflowInstruction.md)\<`TData`\>

Mark the current step as done.

## Type Parameters

### TData

`TData` = `unknown`

## Parameters

### data?

`TData`

Optional JSON-serializable data to persist on the step.

## Returns

[`DoneWorkflowInstruction`](../type-aliases/DoneWorkflowInstruction.md)\<`TData`\>
