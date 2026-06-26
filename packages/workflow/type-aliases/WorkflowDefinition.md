[@faasjs/workflow](../README.md) / WorkflowDefinition

# Type Alias: WorkflowDefinition\<TSteps\>

> **WorkflowDefinition**\<`TSteps`\> = `Readonly`\<\{ `root`: `Extract`\<keyof `TSteps`, `string`\>; `steps`: `TSteps`; `type`: `string`; \}\>

Workflow definition returned by [defineWorkflow](../functions/defineWorkflow.md).

## Type Parameters

### TSteps

`TSteps` _extends_ [`WorkflowSteps`](WorkflowSteps.md) = [`WorkflowSteps`](WorkflowSteps.md)
