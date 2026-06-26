[@faasjs/workflow](../README.md) / RunWorkflowInput

# Type Alias: RunWorkflowInput

> **RunWorkflowInput** = \{ `params?`: `unknown`; `workflowId?`: `never`; \} \| \{ `params?`: `never`; `workflowId`: `string`; \}

Input for [runWorkflow](../functions/runWorkflow.md).

## Union Members

### Type Literal

\{ `params?`: `unknown`; `workflowId?`: `never`; \}

#### params?

> `optional` **params?**: `unknown`

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
