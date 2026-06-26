[@faasjs/workflow](../README.md) / RunWorkflowStepOptions

# Type Alias: RunWorkflowStepOptions

> **RunWorkflowStepOptions** = `object`

Options for [runWorkflowStep](../functions/runWorkflowStep.md).

## Properties

### leaseSeconds?

> `optional` **leaseSeconds?**: `number`

Lease duration in seconds. Defaults to `60`.

### workerId?

> `optional` **workerId?**: `string`

Worker identifier persisted on the claimed step.

### workflowId?

> `optional` **workflowId?**: `string`

Optional workflow id to restrict the claim to one workflow.
