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
    state: z.object({
      retries: z.number(),
      flags: z.object({
        enabled: z.boolean(),
      }),
      tags: z.array(z.string()),
    }),
  })

  const workflow = defineWorkflow({
    type: 'typed_workflow',
    root: 'plan',
    schemas,
    metadataSchema,
    steps: {
      async plan({ params, metadata, patchMetadata, updateMetadata }) {
        expectTypeOf(params).toEqualTypeOf<{
          taskId: string
          count: number
        }>()
        assertType<string>(metadata.tenantId)
        assertType<number>(metadata.state.retries)
        void updateMetadata({
          tenantId: 'tenant_001',
          state: {
            retries: 1,
            flags: {
              enabled: true,
            },
            tags: [],
          },
        })
        void patchMetadata({
          state: {
            flags: {
              enabled: false,
            },
          },
        })
        void patchMetadata((current) => ({
          state: {
            retries: current.state.retries + 1,
          },
        }))
        // @ts-expect-error updateMetadata requires full workflow metadata
        void updateMetadata({
          tenantId: 'tenant_001',
        })
        void patchMetadata({
          state: {
            flags: {
              // @ts-expect-error enabled must remain boolean
              enabled: 'false',
            },
          },
        })

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
        state: {
          retries: 0,
          flags: {
            enabled: true,
          },
          tags: [],
        },
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
        state: {
          retries: 0,
          flags: {
            enabled: true,
          },
          tags: [],
        },
      },
    })

    void runWorkflow(workflow, {
      params: {
        taskId: 'task_001',
        count: 1,
      },
      metadata: {
        tenantId: 'tenant_001',
        state: {
          retries: 0,
          flags: {
            enabled: true,
          },
          tags: [],
        },
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

it('patchMetadata is not available for primitive metadata', () => {
  const metadataSchema = z.string()
  const workflow = defineWorkflow({
    type: 'typed_primitive_metadata_workflow',
    root: 'start',
    metadataSchema,
    steps: {
      async start({ metadata, patchMetadata, updateMetadata }) {
        assertType<string>(metadata)
        void updateMetadata('updated')

        // @ts-expect-error primitive metadata cannot be patched
        void patchMetadata({})

        return done()
      },
    },
  })

  expectTypeOf(workflow.metadataSchema).toEqualTypeOf<typeof metadataSchema | undefined>()
})
