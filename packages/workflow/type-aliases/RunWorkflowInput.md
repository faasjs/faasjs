[@faasjs/workflow](../README.md) / RunWorkflowInput

# Type Alias: RunWorkflowInput\<TParams\>

> **RunWorkflowInput**\<`TParams`\> = \{ `params?`: `TParams`; `workflowId?`: `never`; \} \| \{ `params?`: `never`; `workflowId`: `string`; \}

Input for [runWorkflow](../functions/runWorkflow.md).

## Type Parameters

### TParams

`TParams` = `unknown`

## Union Members

### Type Literal

\{ `params?`: `TParams`; `workflowId?`: `never`; \}

#### params?

> `optional` **params?**: `TParams`

Params used to create a new workflow.

#### workflowId?

> `optional` **workflowId?**: `never`

### Type Literal

\{ `params?`: `never`; `workflowId`: `string`; \}

#### params?

> `optional` **params?**: `never`

#### workflowId

> **workflowId**: `string`

Existing workflow id to resume.
