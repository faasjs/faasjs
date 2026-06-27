[@faasjs/workflow](../README.md) / RunWorkflowInput

# Type Alias: RunWorkflowInput\<TParams, TMetadata\>

> **RunWorkflowInput**\<`TParams`, `TMetadata`\> = \{ `metadata?`: `TMetadata`; `params?`: `TParams`; `workflowId?`: `never`; \} \| \{ `metadata?`: `never`; `params?`: `never`; `workflowId`: `string`; \}

Input for [runWorkflow](../functions/runWorkflow.md).

## Type Parameters

### TParams

`TParams` = `unknown`

### TMetadata

`TMetadata` = `unknown`

## Union Members

### Type Literal

\{ `metadata?`: `TMetadata`; `params?`: `TParams`; `workflowId?`: `never`; \}

#### metadata?

> `optional` **metadata?**: `TMetadata`

Metadata persisted on the workflow. Defaults to `{}`.

#### params?

> `optional` **params?**: `TParams`

Params used to create a new workflow.

#### workflowId?

> `optional` **workflowId?**: `never`

### Type Literal

\{ `metadata?`: `never`; `params?`: `never`; `workflowId`: `string`; \}

#### metadata?

> `optional` **metadata?**: `never`

#### params?

> `optional` **params?**: `never`

#### workflowId

> **workflowId**: `string`

Existing workflow id to resume.
