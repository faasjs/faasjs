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

  const workflow = defineWorkflow({
    type: 'typed_workflow',
    root: 'plan',
    schemas,
    steps: {
      async plan({ params }) {
        expectTypeOf(params).toEqualTypeOf<{
          taskId: string
          count: number
        }>()

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
    })

    void startWorkflow(workflow, {
      params: {
        taskId: 'task_001',
        // @ts-expect-error count should follow the schema output type
        count: '1',
      },
    })

    void runWorkflow(workflow, {
      params: {
        taskId: 'task_001',
        count: 1,
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
