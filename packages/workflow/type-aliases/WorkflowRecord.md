[@faasjs/workflow](../README.md) / WorkflowRecord

# Type Alias: WorkflowRecord

> **WorkflowRecord** = `object`

Persisted row from `faasjs_workflows`.

## Properties

### cancelled_at

> **cancelled_at**: `Date` \| `string` \| `null`

### completed_at

> **completed_at**: `Date` \| `string` \| `null`

### created_at

> **created_at**: `Date` \| `string`

### failed_at

> **failed_at**: `Date` \| `string` \| `null`

### id

> **id**: `string`

### root_step_id

> **root_step_id**: `string` \| `null`

### status

> **status**: [`WorkflowStatus`](WorkflowStatus.md)

### type

> **type**: `string`

### updated_at

> **updated_at**: `Date` \| `string`

### version

> **version**: `number`
