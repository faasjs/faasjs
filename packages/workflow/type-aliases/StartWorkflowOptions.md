[@faasjs/workflow](../README.md) / StartWorkflowOptions

# Type Alias: StartWorkflowOptions\<TParams, TMetadata\>

> **StartWorkflowOptions**\<`TParams`, `TMetadata`\> = `object`

Options for [startWorkflow](../functions/startWorkflow.md).

## Type Parameters

### TParams

`TParams` = `unknown`

### TMetadata

`TMetadata` = `unknown`

## Properties

### metadata?

> `optional` **metadata?**: `TMetadata`

Metadata persisted on the workflow. Defaults to `{}`.

### params?

> `optional` **params?**: `TParams`

Params passed to the root step. Defaults to `{}`.
