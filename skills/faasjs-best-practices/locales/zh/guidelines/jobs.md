# Jobs 指南

当你定义 `.job.ts` 后台任务、投递异步工作，或启动 FaasJS worker 和 scheduler 时，请使用这份指南。

## 默认工作流

1. 在 `src/jobs/` 下创建 `.job.ts` 文件。
2. 使用 default export `defineJob(...)`，当 params 有结构时加上 schema。
3. 在 API、脚本或其他 job 中通过 `enqueueJob(jobPath, params)` 投递工作。
4. 在 worker 进程中运行 `startJobWorker()` 执行业务逻辑。
5. 只有 `.job.ts` 包含 `cron` 规则时，才运行 `startJobScheduler()`。
6. 保持 handler 幂等；执行语义是 at-least-once。

## 规则

### 1. 让文件路径成为 job 名称

Job path 由 worker root 下的 `.job.ts` 文件路径生成：

```text
src/jobs/users/cleanup.job.ts -> jobs/users/cleanup
src/jobs/emails/send.job.ts   -> jobs/emails/send
src/jobs/reports/index.job.ts -> jobs/reports
```

不要在文件里重复手写 job 名称。移动或重命名 job 文件会改变 `enqueueJob()` 使用的路径。

### 2. 在边界处定义 params schema

```ts
import { defineJob } from '@faasjs/jobs'
import * as z from 'zod'

import { sendWelcomeEmail } from '../emails/send-welcome-email'

export default defineJob({
  schema: z.object({
    userId: z.string(),
  }),
  async handler({ params, logger, job }) {
    logger.info('send welcome email to user %s via job %s', params.userId, job.id)

    await sendWelcomeEmail(params.userId)
  },
})
```

当 job 需要访问数据库时，在 handler 内部使用 `@faasjs/pg` 的 `getClient()`。Job handler 不接收外部传入的数据库 client，因此测试和调用方不能悄悄替换默认数据库路径。

如果 job 没有业务入参，省略 `schema`；此时 `params` 类型为 `Record<string, never>`。

### 3. 显式投递异步工作

```ts
import { enqueueJob } from '@faasjs/jobs'

await enqueueJob(
  'jobs/emails/send',
  {
    userId: 'u_123',
  },
  {
    idempotencyKey: 'welcome-email:u_123',
    maxAttempts: 5,
    priority: 10,
  },
)
```

使用 `idempotencyKey` 做投递侧去重。它不代表 handler exactly-once，因此数据库写入和外部调用仍应能承受重试。

### 4. 区分 scheduler 与 worker

Cron 规则只负责投递 job：

```ts
import { defineJob } from '@faasjs/jobs'
import * as z from 'zod'

export default defineJob({
  schema: z.object({
    source: z.string(),
  }),
  cron: [
    {
      expression: '0 3 * * *',
      timezone: 'Asia/Shanghai',
      params: {
        source: 'cron',
      },
    },
  ],
  async handler({ params }) {
    await cleanup(params.source)
  },
})
```

Scheduler 进程负责创建 pending rows，worker 进程负责领取并执行 rows。一个进程可以同时启动两者，但 HTTP server 启动不应该拥有 job 执行生命周期。

### 5. 按 at-least-once 设计执行逻辑

- 崩溃、lease 过期、数据库中断或可重试失败后，handler 可能再次执行。
- 优先使用幂等写入、唯一键和显式状态流转。
- 使用 `maxAttempts` 和 `retry` 让失败行为可见，而不是无限循环。
- 找不到 job 文件时，框架会把错误记录到 job row，并按该 row 的尝试策略重试。

### 6. 用真实 PostgreSQL 行为测试

- 使用 `@faasjs/pg-dev` / PGlite 测试 enqueue、worker、retry 和 scheduler 行为。
- Job 测试中保留 `defineJob` 包装、schema 校验和数据库写入的真实行为。
- 只 mock 邮件服务、存储 API 或第三方 webhook 这类外部系统。

### 7. 直接测试单个 job

将 job 测试放在 job 文件附近，例如 `src/jobs/users/__tests__/cleanup.test.ts` 或 `src/jobs/__tests__/users.cleanup.test.ts`。

对于单个 job 的业务行为，直接调用导出的 job handler。这样可以保留 `defineJob` 包装、schema 校验，以及 `job`、`attempt` 形状，同时不创建 queue row，也不启动 worker 循环。

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'

import dailyReportJob from '../daily-report.job'
import { sendDailyReport } from '../send-daily-report'

vi.mock('../send-daily-report', () => ({
  sendDailyReport: vi.fn(),
}))

const mockedSendDailyReport = vi.mocked(sendDailyReport)

describe('jobs/reports/daily-report', () => {
  beforeEach(() => {
    mockedSendDailyReport.mockReset()
  })

  it('sends the report', async () => {
    await expect(
      dailyReportJob.export().handler({
        params: {
          reportId: 'r_123',
        },
      }),
    ).resolves.toBeUndefined()

    expect(mockedSendDailyReport).toHaveBeenCalledWith('r_123')
  })
})
```

这种直接风格适合测试 handler 成功路径、schema 校验，以及受控外部边界失败。它不测试 queue 生命周期行为，例如 row 创建、领取、完成、重试、idempotency 或 cron 去重。

### 8. 只在需要时测试 queue 行为

把 queue 行为建模为 enqueue、worker 或 scheduler 场景：

- enqueue 用例：调用 `enqueueJob()`，断言 `faasjs_jobs` row 的形状、params、queue、priority、`max_attempts`、`run_at` 和 idempotency 行为
- worker 成功用例：先 enqueue 一条 row，再运行 `worker.poll()`，然后断言可见副作用和 completed job row
- 校验用例：用 `maxAttempts: 1` enqueue 非法 params，运行 `worker.poll()`，并断言 row 因 `Invalid job params` 失败
- retry/failure 用例：通过受控外部边界让 handler 失败，然后断言 `attempts`、`status`、`last_error` 和下一次 `run_at`
- cron 用例：调用一次或两次 `scheduler.tick(fixedDate)`，断言 pending rows、`cron_key`、`scheduled_at`，以及同一分钟内的去重

对于聚焦的 queue 测试，优先使用公开的 `JobWorker` 和 `JobScheduler`，并传入小型内存 registry。直接调用 `poll()` 或 `tick(fixedDate)`，不要启动定时循环。只有当测试目标是文件发现或启动 wiring 时，才使用 `startJobWorker({ root })` 或 `startJobScheduler({ root })`，并在 `finally` 中停止它们。

Queue 生命周期测试示例：

```ts
import { enqueueJob, JobScheduler, JobWorker, type JobRecord } from '@faasjs/jobs'
import { getClient } from '@faasjs/pg'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import dailyReportJob from '../daily-report.job'
import { sendDailyReport } from '../send-daily-report'

vi.mock('../send-daily-report', () => ({
  sendDailyReport: vi.fn(),
}))

const mockedSendDailyReport = vi.mocked(sendDailyReport)

const jobs = new Map([['jobs/reports/daily-report', dailyReportJob]])

describe('jobs/reports/daily-report', () => {
  beforeEach(() => {
    mockedSendDailyReport.mockReset()
  })

  it('runs queued work and sends the report', async () => {
    const client = await getClient()
    const record = await enqueueJob('jobs/reports/daily-report', {
      reportId: 'r_123',
    })
    const worker = new JobWorker(jobs)

    expect(await worker.poll()).toEqual(1)

    const [updated] = await client.raw<JobRecord>`
      SELECT * FROM faasjs_jobs WHERE id = ${record.id}
    `

    expect(updated.status).toEqual('completed')
    expect(mockedSendDailyReport).toHaveBeenCalledWith('r_123')
  })

  it('deduplicates cron enqueue attempts for the same minute', async () => {
    const client = await getClient()
    const scheduler = new JobScheduler(jobs)
    const scheduledAt = new Date('2026-01-01T03:00:00.000Z')

    await scheduler.tick(scheduledAt)
    await scheduler.tick(scheduledAt)

    const rows = await client.raw<JobRecord>`
      SELECT * FROM faasjs_jobs
      WHERE job_path = 'jobs/reports/daily-report'
    `

    expect(rows).toHaveLength(1)
    expect(rows[0].cron_key).toBeTruthy()
    expect(rows[0].scheduled_at).toBeTruthy()
  })
})
```

## 评审清单

- job 文件以 `.job.ts` 结尾，并 default-export `defineJob(...)`
- enqueue path 与文件生成的 job path 对齐
- 结构化 params 使用 schema 校验
- handler 需要访问数据库时使用 `getClient()`，并使用注入的 `logger`
- idempotency 与 retry 行为明确
- cron 规则只投递 job，不直接执行业务逻辑
- worker 和 scheduler 启动与 HTTP server 生命周期分离
- 相关测试覆盖 enqueue row 形状、成功执行、校验、重试/失败和 cron 去重
