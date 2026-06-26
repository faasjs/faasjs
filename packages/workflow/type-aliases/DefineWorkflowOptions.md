[@faasjs/workflow](../README.md) / DefineWorkflowOptions

# Type Alias: DefineWorkflowOptions\<TSteps\>

> **DefineWorkflowOptions**\<`TSteps`\> = `object`

Options for [defineWorkflow](../functions/defineWorkflow.md).

## Type Parameters

### TSteps

`TSteps` _extends_ [`WorkflowSteps`](WorkflowSteps.md) = [`WorkflowSteps`](WorkflowSteps.md)

## Properties

### root

> **root**: `Extract`\<keyof `TSteps`, `string`\>

Root step name.

### steps

> **steps**: `TSteps`

Step handlers keyed by step name.

### type

> **type**: `string`

Business workflow type, for example `agent_workflow`.
