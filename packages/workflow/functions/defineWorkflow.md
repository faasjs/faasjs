[@faasjs/workflow](../README.md) / defineWorkflow

# Function: defineWorkflow()

> **defineWorkflow**\<`TSteps`\>(`options`): [`WorkflowDefinition`](../type-aliases/WorkflowDefinition.md)\<`TSteps`\>

Define a workflow. The definition is explicit and is not registered globally.

## Type Parameters

### TSteps

`TSteps` _extends_ [`WorkflowSteps`](../type-aliases/WorkflowSteps.md)

## Parameters

### options

[`DefineWorkflowOptions`](../type-aliases/DefineWorkflowOptions.md)\<`TSteps`\>

Workflow type, root step name, and step handlers.

## Returns

[`WorkflowDefinition`](../type-aliases/WorkflowDefinition.md)\<`TSteps`\>
