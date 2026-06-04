# Jobs 指南

在定义 `.job.ts` 后台任务、入队异步工作或运行 FaasJS 工作器和调度器时，使用本指南。

## 默认工作流

1. 在 `src/features/<feature>/jobs/` 下创建功能本地 `.job.ts` 文件；跨功能或平台级任务可放在 `src/jobs/` 下。
2. 当参数有结构时，使用 schema 默认导出 `defineJob(...)`。
3. 在 API、脚本或其他任务中使用 `enqueueJob(jobPath, params)` 入队工作。
4. 在工作器进程中运行 `startJobWorker()` 来执行任务。
5. 仅当 `.job.ts` 文件包含 `cron` 规则时，运行 `startJobScheduler()`。
6. 保持处理函数幂等；投递语义为至少一次。

## 规则

### 1. 用文件路径命名任务

任务路径来自相对于工作器根目录的 `.job.ts` 文件：

```text
src/features/users/jobs/cleanup.job.ts -> features/users/jobs/cleanup
src/features/emails/jobs/send.job.ts   -> features/emails/jobs/send
src/features/reports/jobs/index.job.ts -> features/reports/jobs
```

不要在文件内部重复任务名称。移动或重命名任务文件将更改 `enqueueJob()` 使用的路径。

### 2. 在边界处定义参数 schema

```ts
import { defineJob } from '@faasjs/jobs'
import { z } from '@faasjs/utils'

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

当任务需要数据库访问时，在处理函数内部使用 `@faasjs/pg` 的 `getClient()`。任务处理函数不会接收外部提供的数据库客户端，因此测试和调用方无法静默替换默认数据库路径。

如果任务没有业务输入，省略 `schema`；`params` 将被类型化为 `Record<string, never>`。

### 3. 显式入队异步工作

```ts
import { enqueueJob } from '@faasjs/jobs'

await enqueueJob(
  'features/emails/jobs/send',
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

使用 `idempotencyKey` 进行入队端去重。这并不能使处理函数精确执行一次，因此数据库写入和外部调用仍应容忍重试。

### 4. 将调度器与工作器执行分离

Cron 规则仅用于入队任务：

```ts
import { defineJob } from '@faasjs/jobs'
import { z } from '@faasjs/utils'

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

运行调度器进程以创建待处理行，运行工作器进程以认领并执行这些行。一个进程可以同时启动两者，但 HTTP 服务器启动不应成为任务执行的所有者。

### 5. 将执行视为至少一次

- 处理函数可能在崩溃、租约过期、数据库中断或可重试失败后再次运行。
- 优先使用幂等写入、唯一键和显式状态转换。
- 使用 `maxAttempts` 和 `retry` 使失败行为可见，而不是无限循环。
- 缺失的任务文件将被记录为任务失败，并根据行的重试策略进行重试。

### 6. 使用真实的 PostgreSQL 行为进行测试

- 使用 `@faasjs/pg-dev` / PGlite 测试入队、工作器、重试和调度器行为。
- 在任务测试中保持 `defineJob` 包装器、schema 验证和数据库写入的真实性。
- 仅模拟外部服务，如邮件提供商、存储 API 或第三方 webhook。

### 7. 直接测试单个任务

将任务测试放在任务文件夹的 `__tests__` 下，例如 `cleanup.job.ts` 对应的 `src/features/users/jobs/__tests__/cleanup.test.ts`。

对于单个任务的业务行为，直接调用导出的任务处理函数。这样可以保持 `defineJob` 包装器、schema 验证、`job` 和 `attempt` 结构的真实性，而无需创建队列行或启动工作器循环。

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'

import dailyReportJob from '../daily-report.job'
import { sendDailyReport } from '../send-daily-report'

vi.mock('../send-daily-report', () => ({
  sendDailyReport: vi.fn(),
}))

const mockedSendDailyReport = vi.mocked(sendDailyReport)

describe('features/reports/jobs/daily-report', () => {
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

使用这种直接风格测试处理函数成功、schema 验证和受控的外部边界失败。这不会测试队列生命周期行为，如行创建、认领、完成、重试、幂等性或 cron 去重。

### 8. 仅在必要时测试队列行为

将队列行为建模为入队、工作器或调度器场景：

- 入队场景：调用 `enqueueJob()` 并断言 `faasjs_jobs` 行结构、参数、队列、优先级、`max_attempts`、`run_at` 和幂等性行为
- 工作器成功场景：入队一行，运行 `worker.poll()`，然后断言可见的副作用和已完成的任务行
- 验证场景：使用 `maxAttempts: 1` 入队无效参数，运行 `worker.poll()`，并断言行失败并显示 `Invalid job params` 错误
- 重试/失败场景：通过受控的外部边界使处理函数失败，然后断言 `attempts`、`status`、`last_error` 和下一次 `run_at`
- cron 场景：调用 `scheduler.tick(fixedDate)` 一次或两次，并断言待处理行、`cron_key`、`scheduled_at` 以及同一分钟的去重

对于聚焦的队列测试，优先使用带有小型内存注册表的公共 `JobWorker` 和 `JobScheduler`。直接调用 `poll()` 或 `tick(fixedDate)`，而不是启动定时器循环。仅当测试的行为是文件发现或启动连接时使用 `startJobWorker({ root })` 或 `startJobScheduler({ root })`，并在 `finally` 中停止它们。

示例队列生命周期测试：

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

const jobs = new Map([['features/reports/jobs/daily-report', dailyReportJob]])

describe('features/reports/jobs/daily-report', () => {
  beforeEach(() => {
    mockedSendDailyReport.mockReset()
  })

  it('runs queued work and sends the report', async () => {
    const client = await getClient()
    const record = await enqueueJob('features/reports/jobs/daily-report', {
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
      WHERE job_path = 'features/reports/jobs/daily-report'
    `

    expect(rows).toHaveLength(1)
    expect(rows[0].cron_key).toBeTruthy()
    expect(rows[0].scheduled_at).toBeTruthy()
  })
})
```

## 审查清单

- 任务文件以 `.job.ts` 结尾并默认导出 `defineJob(...)`
- 入队路径与文件派生的任务路径匹配
- 参数在结构化时使用 schema 进行验证
- 处理函数在需要数据库访问时使用 `getClient()`，并使用注入的 `logger`
- 幂等性和重试行为是显式的
- cron 规则入队任务而不是直接执行工作
- 工作器和调度器启动与 HTTP 服务器生命周期分离
- 测试在相关时覆盖入队结构、成功、验证、重试/失败和 cron 去重
