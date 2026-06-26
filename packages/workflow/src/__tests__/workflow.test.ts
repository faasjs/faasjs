import { getClient, getClients, type Client } from '@faasjs/pg'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import {
  defineWorkflow,
  done,
  fail,
  fork,
  next,
  runWorkflow,
  runWorkflowStep,
  startWorkflow,
  type WorkflowRecord,
  type WorkflowStepRecord,
} from '../index'
import { ensureWorkflowSchema } from '../schema'

describe('workflow', () => {
  let client: Client

  beforeEach(async () => {
    client = await getClient()
    await ensureWorkflowSchema(client)
    await client.raw`TRUNCATE faasjs_workflow_steps, faasjs_workflows RESTART IDENTITY`
  })

  afterAll(async () => {
    await Promise.allSettled(getClients().map((cachedClient) => cachedClient.quit()))
  })

  it('validates workflow definitions without a registry', () => {
    expect(() =>
      defineWorkflow({
        type: '',
        root: 'start',
        steps: {
          async start() {
            return done()
          },
        },
      }),
    ).toThrow('type must not be empty')

    expect(() =>
      defineWorkflow({
        type: 'agent_workflow',
        root: 'missing',
        steps: {
          async start() {
            return done()
          },
        },
      } as any),
    ).toThrow('root step "missing" is missing')
  })

  it('starts a workflow and persists workflow_type on the root step', async () => {
    const workflow = defineWorkflow({
      type: 'agent_workflow',
      root: 'start',
      steps: {
        async start() {
          return done()
        },
      },
    })

    const { workflowId } = await startWorkflow(workflow, {
      params: {
        taskId: 'task_001',
      },
    })

    const [record] = await client.raw<WorkflowRecord>`
      SELECT * FROM faasjs_workflows WHERE id = ${workflowId}
    `
    const [step] = await client.raw<WorkflowStepRecord>`
      SELECT * FROM faasjs_workflow_steps WHERE workflow_id = ${workflowId}
    `

    expect(record).toMatchObject({
      id: workflowId,
      type: 'agent_workflow',
      status: 'running',
      root_step_id: step.id,
    })
    expect(step).toMatchObject({
      workflow_id: workflowId,
      workflow_type: 'agent_workflow',
      name: 'start',
      params: {
        taskId: 'task_001',
      },
      status: 'runnable',
    })
  })

  it('runs at most one step per runWorkflowStep call', async () => {
    const workflow = defineWorkflow({
      type: 'single_step_workflow',
      root: 'start',
      steps: {
        async start() {
          return next('finish')
        },
        async finish() {
          return done()
        },
      },
    })
    const { workflowId } = await startWorkflow(workflow)

    const result = await runWorkflowStep(workflow, {
      workflowId,
    })

    const steps = await client.raw<WorkflowStepRecord>`
      SELECT * FROM faasjs_workflow_steps ORDER BY seq
    `
    const [record] = await client.raw<WorkflowRecord>`
      SELECT * FROM faasjs_workflows WHERE id = ${workflowId}
    `

    expect(result).toMatchObject({
      claimed: true,
      workflowId,
      workflowStatus: 'running',
    })
    expect(steps).toMatchObject([
      {
        name: 'start',
        status: 'done',
        next_step_id: steps[1].id,
      },
      {
        name: 'finish',
        status: 'runnable',
      },
    ])
    expect(record.status).toEqual('running')
  })

  it('runs a new workflow to completion', async () => {
    const visited: string[] = []
    const workflow = defineWorkflow({
      type: 'complete_workflow',
      root: 'plan',
      steps: {
        async plan(ctx) {
          visited.push(`plan:${(ctx.params as any).taskId}`)

          return next('run', {
            taskId: (ctx.params as any).taskId,
          })
        },
        async run(ctx) {
          visited.push(`run:${(ctx.params as any).taskId}`)

          return done({
            ok: true,
          })
        },
      },
    })

    const result = await runWorkflow(workflow, {
      params: {
        taskId: 'task_001',
      },
    })

    const [record] = await client.raw<WorkflowRecord>`
      SELECT * FROM faasjs_workflows WHERE id = ${result.workflowId}
    `

    expect(result).toMatchObject({
      status: 'completed',
      stepsRun: 2,
    })
    expect(record.status).toEqual('completed')
    expect(record.completed_at).toBeTruthy()
    expect(visited).toEqual(['plan:task_001', 'run:task_001'])
  })

  it('resumes an existing workflow by workflowId', async () => {
    const workflow = defineWorkflow({
      type: 'resume_workflow',
      root: 'start',
      steps: {
        async start() {
          return next('finish')
        },
        async finish() {
          return done()
        },
      },
    })
    const { workflowId } = await startWorkflow(workflow)

    await runWorkflowStep(workflow, {
      workflowId,
    })

    const result = await runWorkflow(workflow, {
      workflowId,
    })

    expect(result).toEqual({
      workflowId,
      status: 'completed',
      stepsRun: 1,
    })
  })

  it('fails the workflow when a step returns fail without next', async () => {
    const workflow = defineWorkflow({
      type: 'fail_workflow',
      root: 'start',
      steps: {
        async start() {
          return fail(Error('boom'))
        },
      },
    })

    const result = await runWorkflow(workflow, {})
    const [step] = await client.raw<WorkflowStepRecord>`
      SELECT * FROM faasjs_workflow_steps
    `

    expect(result.status).toEqual('failed')
    expect(step.status).toEqual('failed')
    expect(step.error).toMatchObject({
      message: 'boom',
    })
  })

  it('records fail with next as a recoverable failure', async () => {
    const workflow = defineWorkflow({
      type: 'recover_workflow',
      root: 'run',
      steps: {
        async run(ctx) {
          const retry = (ctx.params as any).retry ?? 0

          if (retry === 0) {
            return fail(Error('retryable'), {
              next: {
                name: 'run',
                params: {
                  retry: 1,
                },
              },
            })
          }

          return done()
        },
      },
    })

    const result = await runWorkflow(workflow, {})
    const steps = await client.raw<WorkflowStepRecord>`
      SELECT * FROM faasjs_workflow_steps ORDER BY seq
    `

    expect(result).toMatchObject({
      status: 'completed',
      stepsRun: 2,
    })
    expect(steps).toMatchObject([
      {
        name: 'run',
        status: 'failed',
        next_step_id: steps[1].id,
      },
      {
        name: 'run',
        status: 'done',
      },
    ])
  })

  it('treats thrown handler errors as failures', async () => {
    const workflow = defineWorkflow({
      type: 'throw_workflow',
      root: 'start',
      steps: {
        async start() {
          throw Error('handler exploded')
        },
      },
    })

    const result = await runWorkflow(workflow, {})
    const [step] = await client.raw<WorkflowStepRecord>`
      SELECT * FROM faasjs_workflow_steps
    `

    expect(result.status).toEqual('failed')
    expect(step.error).toMatchObject({
      message: 'handler exploded',
    })
  })

  it('joins fork branches after all branch heads complete', async () => {
    const workflow = defineWorkflow({
      type: 'fork_workflow',
      root: 'start',
      steps: {
        async start() {
          return fork([
            {
              name: 'branch',
              params: {
                id: 'a',
              },
            },
            {
              name: 'branch',
              params: {
                id: 'b',
              },
            },
          ])
        },
        async branch(ctx) {
          return done({
            id: (ctx.params as any).id,
          })
        },
      },
    })

    const result = await runWorkflow(workflow, {})
    const steps = await client.raw<WorkflowStepRecord>`
      SELECT * FROM faasjs_workflow_steps ORDER BY seq
    `

    expect(result).toMatchObject({
      status: 'completed',
      stepsRun: 3,
    })
    expect(steps[0]).toMatchObject({
      name: 'start',
      status: 'done',
      fork_child_ids: [steps[1].id, steps[2].id],
    })
    expect(steps.slice(1).map((step) => step.status)).toEqual(['done', 'done'])
  })

  it('replaces fork branch heads when a branch returns next', async () => {
    const workflow = defineWorkflow({
      type: 'fork_next_workflow',
      root: 'start',
      steps: {
        async start() {
          return fork([
            {
              name: 'branch',
              params: {
                id: 'a',
              },
            },
            {
              name: 'branch',
              params: {
                id: 'b',
              },
            },
          ])
        },
        async branch(ctx) {
          return next('finish', {
            id: (ctx.params as any).id,
          })
        },
        async finish() {
          return done()
        },
      },
    })

    const result = await runWorkflow(workflow, {})
    const steps = await client.raw<WorkflowStepRecord>`
      SELECT * FROM faasjs_workflow_steps ORDER BY seq
    `
    const parent = steps[0]
    const branchSteps = steps.filter((step) => step.name === 'branch')
    const finishSteps = steps.filter((step) => step.name === 'finish')

    expect(result).toMatchObject({
      status: 'completed',
      stepsRun: 5,
    })
    expect(branchSteps.every((step) => step.status === 'done' && step.next_step_id)).toEqual(true)
    expect(parent.fork_child_ids).toEqual(finishSteps.map((step) => step.id))
    expect(finishSteps.map((step) => step.status)).toEqual(['done', 'done'])
  })

  it('replaces fork branch heads when a branch returns fail with next', async () => {
    const workflow = defineWorkflow({
      type: 'fork_fail_next_workflow',
      root: 'start',
      steps: {
        async start() {
          return fork([
            {
              name: 'branch',
              params: {
                id: 'a',
              },
            },
            {
              name: 'branch',
              params: {
                id: 'b',
              },
            },
          ])
        },
        async branch(ctx) {
          const retry = (ctx.params as any).retry ?? 0

          if ((ctx.params as any).id === 'a' && retry === 0) {
            return fail(Error('retry branch'), {
              next: {
                name: 'branch',
                params: {
                  id: 'a',
                  retry: 1,
                },
              },
            })
          }

          return done()
        },
      },
    })

    const result = await runWorkflow(workflow, {})
    const steps = await client.raw<WorkflowStepRecord>`
      SELECT * FROM faasjs_workflow_steps ORDER BY seq
    `
    const parent = steps[0]
    const failedBranch = steps.find((step) => step.status === 'failed')
    const replacement = steps.find((step) => step.id === failedBranch?.next_step_id)

    expect(result).toMatchObject({
      status: 'completed',
      stepsRun: 4,
    })
    expect(failedBranch).toMatchObject({
      name: 'branch',
      status: 'failed',
    })
    expect(replacement).toMatchObject({
      name: 'branch',
      status: 'done',
    })
    expect(parent.fork_child_ids).not.toContain(failedBranch?.id)
    expect(parent.fork_child_ids).toContain(replacement?.id)
  })

  it('claims steps by workflow_type', async () => {
    const events: string[] = []
    const agentWorkflow = defineWorkflow({
      type: 'agent_workflow',
      root: 'start',
      steps: {
        async start() {
          events.push('agent')

          return done()
        },
      },
    })
    const monitorWorkflow = defineWorkflow({
      type: 'monitor_workflow',
      root: 'start',
      steps: {
        async start() {
          events.push('monitor')

          return done()
        },
      },
    })

    const agent = await startWorkflow(agentWorkflow)
    const monitor = await startWorkflow(monitorWorkflow)

    await runWorkflowStep(agentWorkflow)

    const [agentRecord] = await client.raw<WorkflowRecord>`
      SELECT * FROM faasjs_workflows WHERE id = ${agent.workflowId}
    `
    const [monitorRecord] = await client.raw<WorkflowRecord>`
      SELECT * FROM faasjs_workflows WHERE id = ${monitor.workflowId}
    `

    expect(events).toEqual(['agent'])
    expect(agentRecord.status).toEqual('completed')
    expect(monitorRecord.status).toEqual('running')
  })

  it('does not let an expired old lease overwrite a newer claim result', async () => {
    let calls = 0
    let firstStarted: (() => void) | undefined
    let releaseFirst: (() => void) | undefined
    const firstStartedPromise = new Promise<void>((resolve) => {
      firstStarted = resolve
    })
    const releaseFirstPromise = new Promise<void>((resolve) => {
      releaseFirst = resolve
    })
    const workflow = defineWorkflow({
      type: 'lease_workflow',
      root: 'start',
      steps: {
        async start() {
          calls += 1

          if (calls === 1) {
            firstStarted?.()
            await releaseFirstPromise

            return done('old')
          }

          return done('new')
        },
      },
    })
    const { workflowId } = await startWorkflow(workflow)

    const firstRun = runWorkflowStep(workflow, {
      workflowId,
      leaseSeconds: 1,
      workerId: 'old-worker',
    })

    await firstStartedPromise
    await new Promise((resolve) => setTimeout(resolve, 1100))

    const secondRun = await runWorkflowStep(workflow, {
      workflowId,
      workerId: 'new-worker',
    })

    releaseFirst?.()
    await firstRun

    const [step] = await client.raw<WorkflowStepRecord>`
      SELECT * FROM faasjs_workflow_steps WHERE workflow_id = ${workflowId}
    `

    expect(secondRun).toMatchObject({
      claimed: true,
      workflowStatus: 'completed',
    })
    expect(step).toMatchObject({
      status: 'done',
      data: 'new',
    })
  })

  it('uses skip locked so concurrent workers claim different steps', async () => {
    const releases: Array<() => void> = []
    const started: string[] = []
    const workflow = defineWorkflow({
      type: 'skip_locked_workflow',
      root: 'start',
      steps: {
        async start(ctx) {
          started.push(ctx.workflowId)

          await new Promise<void>((resolve) => {
            releases.push(resolve)
          })

          return done()
        },
      },
    })
    const first = await startWorkflow(workflow)
    const second = await startWorkflow(workflow)

    const firstRun = runWorkflowStep(workflow, {
      workerId: 'worker-1',
    })

    while (started.length < 1) {
      await new Promise((resolve) => setTimeout(resolve, 10))
    }

    const secondRun = runWorkflowStep(workflow, {
      workerId: 'worker-2',
    })

    while (started.length < 2) {
      await new Promise((resolve) => setTimeout(resolve, 10))
    }

    for (const release of releases) release()

    await Promise.all([firstRun, secondRun])

    expect(started.sort()).toEqual([first.workflowId, second.workflowId].sort())
  })

  it('supports runWorkflow maxSteps, timeoutMs, and signal limits', async () => {
    const workflow = defineWorkflow({
      type: 'limits_workflow',
      root: 'start',
      steps: {
        async start() {
          return next('finish')
        },
        async finish() {
          return done()
        },
      },
    })

    await expect(
      runWorkflow(
        workflow,
        {},
        {
          maxSteps: 1,
        },
      ),
    ).rejects.toThrow('maxSteps exceeded')

    await client.raw`TRUNCATE faasjs_workflow_steps, faasjs_workflows RESTART IDENTITY`

    const { workflowId } = await startWorkflow(workflow)

    await client.raw`
      UPDATE faasjs_workflow_steps
      SET status = 'waiting'
      WHERE workflow_id = ${workflowId}
    `

    await expect(
      runWorkflow(
        workflow,
        {
          workflowId,
        },
        {
          timeoutMs: 1,
          pollIntervalMs: 10,
        },
      ),
    ).rejects.toThrow('timeout exceeded')

    const controller = new AbortController()
    const started = await startWorkflow(workflow)

    controller.abort(Error('aborted test'))

    await expect(
      runWorkflow(
        workflow,
        {
          workflowId: started.workflowId,
        },
        {
          signal: controller.signal,
        },
      ),
    ).rejects.toThrow('aborted test')
  })
})
