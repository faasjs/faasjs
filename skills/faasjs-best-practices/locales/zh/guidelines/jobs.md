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

export default defineJob({
  schema: z.object({
    userId: z.string(),
  }),
  async handler({ params, client, logger, job }) {
    logger.info('sync user %s via job %s', params.userId, job.id)

    await client.raw`SELECT 1`
  },
})
```

使用由 `@faasjs/pg` 注入的 `client`。除非这个 job 明确要访问另一个数据库，否则不要创建或传入第二个数据库 client。

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
- Job 测试中保留 FaasJS loader、schema 校验和数据库写入的真实行为。
- 只 mock 邮件服务、存储 API 或第三方 webhook 这类外部系统。

## 评审清单

- job 文件以 `.job.ts` 结尾，并 default-export `defineJob(...)`
- enqueue path 与文件生成的 job path 对齐
- 结构化 params 使用 schema 校验
- handler 使用注入的 `client` 和 `logger`
- idempotency 与 retry 行为明确
- cron 规则只投递 job，不直接执行业务逻辑
- worker 和 scheduler 启动与 HTTP server 生命周期分离
- 相关测试覆盖 enqueue、成功执行、重试/失败和 cron 去重
