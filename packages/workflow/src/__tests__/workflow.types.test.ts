import { z } from '@faasjs/utils'
import { assertType, expectTypeOf, it } from 'vitest'

import {
  defineWorkflow,
  done,
  next,
  runWorkflow,
  startWorkflow,
  type WorkflowStepParams,
} from '../index'

it('defineWorkflow infers step params from schemas', () => {
  const schemas = {
    plan: z.object({
      taskId: z.string(),
      count: z.coerce.number(),
    }),
    run: z.object({
      taskId: z.string(),
    }),
  }
  const metadataSchema = z.object({
    tenantId: z.string(),
  })

  const workflow = defineWorkflow({
    type: 'typed_workflow',
    root: 'plan',
    schemas,
    metadataSchema,
    steps: {
      async plan({ params, metadata }) {
        expectTypeOf(params).toEqualTypeOf<{
          taskId: string
          count: number
        }>()
        assertType<string>(metadata.tenantId)

        // @ts-expect-error missing is not defined by the plan schema
        assertType<never>(params.missing)

        return next('run', {
          taskId: params.taskId,
        })
      },
      async run({ params }) {
        assertType<string>(params.taskId)

        return done()
      },
    },
  })

  assertType<WorkflowStepParams<typeof schemas, 'plan'>>({
    taskId: 'task_001',
    count: 1,
  })

  if (process.env.NODE_ENV === 'type-only') {
    void startWorkflow(workflow, {
      params: {
        taskId: 'task_001',
        count: 1,
      },
      metadata: {
        tenantId: 'tenant_001',
      },
    })

    void startWorkflow(workflow, {
      params: {
        taskId: 'task_001',
        // @ts-expect-error count should follow the schema output type
        count: '1',
      },
      metadata: {
        tenantId: 'tenant_001',
      },
    })

    void runWorkflow(workflow, {
      params: {
        taskId: 'task_001',
        count: 1,
      },
      metadata: {
        tenantId: 'tenant_001',
      },
    })

    void runWorkflow(workflow, {
      params: {
        taskId: 'task_001',
        // @ts-expect-error root params should follow the root schema output type
        count: '1',
      },
    })
  }
})

it('defineWorkflow infers metadata from metadataSchema', () => {
  const metadataSchema = z.object({
    tenantId: z.string(),
    priority: z.coerce.number(),
  })
  const workflow = defineWorkflow({
    type: 'typed_metadata_workflow',
    root: 'start',
    metadataSchema,
    steps: {
      async start({ metadata }) {
        expectTypeOf(metadata).toEqualTypeOf<{
          tenantId: string
          priority: number
        }>()
        assertType<string>(metadata.tenantId)
        assertType<number>(metadata.priority)

        // @ts-expect-error missing is not defined by the metadata schema
        assertType<never>(metadata.missing)

        return done()
      },
    },
  })

  expectTypeOf(workflow.metadataSchema).toEqualTypeOf<typeof metadataSchema | undefined>()

  if (process.env.NODE_ENV === 'type-only') {
    void startWorkflow(workflow, {
      metadata: {
        tenantId: 'tenant_001',
        priority: 1,
      },
    })

    void startWorkflow(workflow, {
      metadata: {
        tenantId: 'tenant_001',
        // @ts-expect-error priority should follow the metadata schema output type
        priority: '1',
      },
    })

    void runWorkflow(workflow, {
      metadata: {
        tenantId: 'tenant_001',
        priority: 1,
      },
    })

    void runWorkflow(
      workflow,
      // @ts-expect-error metadata is only accepted when creating a workflow
      {
        workflowId: 'workflow_001',
        metadata: {
          tenantId: 'tenant_001',
          priority: 1,
        },
      },
    )
  }
})
