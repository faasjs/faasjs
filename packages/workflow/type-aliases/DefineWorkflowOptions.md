[@faasjs/workflow](../README.md) / DefineWorkflowOptions

# Type Alias: DefineWorkflowOptions\<TSteps, TRoot, TSchemas\>

> **DefineWorkflowOptions**\<`TSteps`, `TRoot`, `TSchemas`\> = `Omit`\<[`DefineWorkflowOptionsInput`](DefineWorkflowOptionsInput.md), `"root"` \| `"steps"` \| `"schemas"`\> & `object` & `TSchemas` _extends_ [`WorkflowStepSchemas`](WorkflowStepSchemas.md) ? `object` : `object`

Options for [defineWorkflow](../functions/defineWorkflow.md).

## Type Declaration

### root

> **root**: `TRoot`

Root step name.

### steps

> **steps**: `TSteps`

Step handlers keyed by step name.

## Type Parameters

### TSteps

`TSteps` _extends_ [`WorkflowSteps`](WorkflowSteps.md) = [`WorkflowSteps`](WorkflowSteps.md)

### TRoot

`TRoot` _extends_ `Extract`\<keyof `TSteps`, `string`\> = `Extract`\<keyof `TSteps`, `string`\>

### TSchemas

`TSchemas` _extends_ [`WorkflowStepSchemas`](WorkflowStepSchemas.md) \| `undefined` = `undefined`
