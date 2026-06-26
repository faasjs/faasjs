[@faasjs/workflow](../README.md) / WorkflowStepRecord

# Type Alias: WorkflowStepRecord

> **WorkflowStepRecord** = `object`

Persisted row from `faasjs_workflow_steps`.

## Properties

### created_at

> **created_at**: `Date` \| `string`

### data

> **data**: `unknown`

### error

> **error**: `unknown`

### fork_child_ids

> **fork_child_ids**: `string`[] \| `null`

### id

> **id**: `string`

### lease_id

> **lease_id**: `string` \| `null`

### locked_by

> **locked_by**: `string` \| `null`

### locked_until

> **locked_until**: `Date` \| `string` \| `null`

### name

> **name**: `string`

### next_step_id

> **next_step_id**: `string` \| `null`

### params

> **params**: `unknown`

### parent_id

> **parent_id**: `string` \| `null`

### seq

> **seq**: `number` \| `string`

### status

> **status**: [`WorkflowStepStatus`](WorkflowStepStatus.md)

### updated_at

> **updated_at**: `Date` \| `string`

### workflow_id

> **workflow_id**: `string`

### workflow_type

> **workflow_type**: `string`
