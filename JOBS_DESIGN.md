# @faasjs/jobs 设计方案

## 背景

FaasJS 现有定时任务能力是 `@faasjs/core` 内的进程内 `CronJob`。它基于 `setTimeout` 在当前进程中按分钟触发 handler，适合简单场景，但不适合作为生产级后台任务系统：

- 多实例部署时缺少全局去重与锁。
- 进程退出后任务状态不可恢复。
- 没有持久化的执行记录、失败记录和重试状态。
- 定时触发与业务执行耦合在同一个 handler 中。
- HTTP server 生命周期和后台任务生命周期混在一起，不利于独立部署 worker。

新的方案是删除现有 `CronJob`，新增 `@faasjs/jobs` 包，提供基于 PostgreSQL 的异步 Job 系统。

## 目标

- 使用 PostgreSQL 作为唯一官方后台 Job 存储与锁协调机制。
- 使用 `.job.ts` 文件约定自动发现 Job handler，延续 FaasJS 的路径即标识传统。
- 所有命名统一到 `job` 语境：`defineJob`、`enqueueJob`、`startJobWorker`、`startJobScheduler`。
- 支持异步执行、延迟执行、失败重试、执行记录、并发 worker 和定时投递。
- 普通用户不需要传数据库 client；内部统一使用 `@faasjs/pg` 的 `getClient()`。
- 定时配置只负责投递 Job，不直接执行业务逻辑。

## 非目标

- 不兼容旧的 `CronJob` API。
- 不保留 `ServerOptions.cronJob`。
- 不支持多数据库抽象，官方实现只面向 PostgreSQL。
- 不承诺 exactly-once，只承诺 at-least-once。
- 不把 worker 自动挂到 HTTP server 生命周期上。

## 包边界

### `@faasjs/core`

删除：

- `CronJob`
- `createCronJob`
- `removeCronJob`
- `listCronJobs`
- `mountServerCronJobs`
- `unmountServerCronJobs`
- `ServerOptions.cronJob`
- `Server.listen()` 和 `Server.close()` 中的 cron 生命周期逻辑

`@faasjs/core` 保持 API、server、Func、plugin 等基础能力，不再包含后台任务。

### `@faasjs/jobs`

新增包，依赖：

- `@faasjs/core`：复用 `Func` 和 plugin 生命周期。
- `@faasjs/pg`：通过 `getClient()` 读写 PostgreSQL。
- `@faasjs/node-utils`：复用 `loadPackage`、`loadPlugins`、`Logger` 等 Node 运行时能力。

## 文件约定

Job 文件使用 `.job.ts` 后缀：

```txt
src/jobs/users/cleanup.job.ts
src/jobs/emails/send.job.ts
src/jobs/reports/index.job.ts
```

`job_path` 由文件路径生成，作为数据库中的 Job 标识：

```txt
src/jobs/users/cleanup.job.ts -> jobs/users/cleanup
src/jobs/emails/send.job.ts   -> jobs/emails/send
src/jobs/reports/index.job.ts -> jobs/reports
```

约定：

- 不需要用户手写 Job 名称。
- 不支持 `default.job.ts` fallback。
- 支持 `index.job.ts` 作为目录入口。
- 路径分隔符在数据库中统一为 `/`。
- 移动或重命名 `.job.ts` 会改变 `job_path`，语义上等同于修改 `.api.ts` 路由路径。

## Job 定义

```ts
// src/jobs/users/cleanup.job.ts
import { defineJob, z } from '@faasjs/jobs'

export default defineJob({
  schema: z.object({
    before: z.string(),
  }),
  queue: 'default',
  maxAttempts: 5,
  cron: [
    {
      expression: '0 3 * * *',
      timezone: 'Asia/Shanghai',
      payload: {
        before: 'now',
      },
    },
  ],
  async handler({ payload, client, logger, job }) {
    logger.info('cleanup before %s', payload.before)

    await client.raw`
      DELETE FROM sessions
      WHERE updated_at < NOW() - INTERVAL '30 days'
    `

    logger.info('job %s completed', job.id)
  },
})
```

`defineJob` 不要求 HTTP plugin。它只负责：

- 定义 payload schema。
- 定义默认 queue、重试次数、重试策略。
- 定义 cron 投递规则。
- 暴露 handler 给 worker 执行。
- 通过 `Func` 生命周期支持项目插件。

## Public API

```ts
import { defineJob, enqueueJob, startJobScheduler, startJobWorker, z } from '@faasjs/jobs'
```

### `defineJob`

```ts
defineJob({
  schema,
  queue,
  maxAttempts,
  retry,
  cron,
  handler,
})
```

### `enqueueJob`

```ts
await enqueueJob('jobs/emails/send', {
  userId: 'u_123',
})
```

可选参数：

```ts
await enqueueJob(
  'jobs/emails/send',
  {
    userId: 'u_123',
  },
  {
    queue: 'default',
    runAt: new Date(Date.now() + 60_000),
    priority: 10,
    idempotencyKey: 'send-email:u_123:welcome',
    maxAttempts: 5,
  },
)
```

`enqueueJob` 内部调用 `getClient()`，不接收 `client` 参数。

### `startJobWorker`

```ts
await startJobWorker({
  root: 'src',
  queue: 'default',
  concurrency: 5,
  pollInterval: 1000,
  leaseSeconds: 60,
})
```

`root` 默认可解析为项目的 `src` 目录。worker 启动时扫描 `root/**/*.job.ts`，加载 default export，建立 `job_path -> Job` 的内存注册表。

worker 的职责：

- 从 `faasjs_jobs` 表领取到期 Job。
- 根据 `job_path` 查找 `.job.ts` handler。
- 校验 payload schema。
- 执行业务 handler。
- 成功后标记 completed。
- 失败后记录错误并按 retry/backoff 重新进入 pending，或达到上限后标记 failed。

### `startJobScheduler`

```ts
await startJobScheduler({
  root: 'src',
  pollInterval: 30_000,
})
```

scheduler 的职责：

- 扫描 `root/**/*.job.ts`。
- 读取每个 Job 的 `cron` 配置。
- 每分钟判断哪些 cron 规则到期。
- 到期后向 `faasjs_jobs` 表插入 pending Job。
- 不执行业务 handler。

worker 和 scheduler 可以部署在同一个进程，也可以拆成独立进程。

## Worker 与 Scheduler 的区别

scheduler 负责“什么时候产生 Job”：

```txt
cron 配置 -> scheduler 到点 enqueue -> faasjs_jobs 出现 pending 记录
```

worker 负责“执行已经产生的 Job”：

```txt
pending 记录 -> worker 领取 -> 执行 .job.ts handler -> completed / retry / failed
```

手动异步任务只需要 worker：

```ts
await enqueueJob('jobs/emails/send', { userId: 'u_123' })
```

定时任务才需要 scheduler。

## 数据库设计

主表：

```sql
CREATE TABLE IF NOT EXISTS faasjs_jobs (
  id uuid PRIMARY KEY,
  job_path text NOT NULL,
  queue text NOT NULL DEFAULT 'default',
  payload jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL,
  run_at timestamptz NOT NULL,
  priority integer NOT NULL DEFAULT 0,
  attempts integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 3,
  locked_by text,
  lease_id uuid,
  locked_until timestamptz,
  last_error text,
  idempotency_key text,
  cron_key text,
  scheduled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  completed_at timestamptz,
  failed_at timestamptz
);
```

建议索引：

```sql
CREATE INDEX IF NOT EXISTS faasjs_jobs_claim_idx
  ON faasjs_jobs (queue, status, run_at, priority DESC, created_at)
  WHERE status IN ('pending', 'running');

CREATE UNIQUE INDEX IF NOT EXISTS faasjs_jobs_idempotency_key_idx
  ON faasjs_jobs (idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS faasjs_jobs_cron_idx
  ON faasjs_jobs (job_path, cron_key, scheduled_at)
  WHERE cron_key IS NOT NULL AND scheduled_at IS NOT NULL;
```

`@faasjs/jobs` 可以在 `enqueueJob`、`startJobWorker`、`startJobScheduler` 前自动执行幂等 schema 初始化，减少用户配置。

## 领取逻辑

worker 不按已发现的 `job_path` 过滤数据库记录，避免随着 Job 数量增长导致 SQL 越来越长。

领取 SQL 按 queue、状态、时间、优先级选择：

```sql
WITH picked AS (
  SELECT id
  FROM faasjs_jobs
  WHERE queue = $1
    AND run_at <= NOW()
    AND (
      status = 'pending'
      OR (status = 'running' AND locked_until < NOW())
    )
  ORDER BY priority DESC, run_at ASC, created_at ASC
  FOR UPDATE SKIP LOCKED
  LIMIT 1
)
UPDATE faasjs_jobs
SET
  status = 'running',
  attempts = attempts + 1,
  locked_by = $2,
  lease_id = $3,
  locked_until = NOW() + $4::interval,
  updated_at = NOW()
WHERE id IN (SELECT id FROM picked)
RETURNING *;
```

如果当前版本找不到对应 `job_path` 的 `.job.ts`：

- 记录错误。
- 按失败重试逻辑设置下一次 `run_at`。
- 不让 worker 进程崩溃。
- 等后续版本或其他 worker 重试执行。

## 执行语义

`@faasjs/jobs` 的执行语义是 at-least-once。

同一个 Job 在以下场景中可能被再次执行：

- worker 执行成功但完成状态写回失败。
- worker 崩溃导致 lease 过期。
- 数据库连接中断。
- handler 抛错后进入重试。

因此 Job handler 应该尽量幂等。框架提供 `idempotencyKey` 辅助投递去重，但不承诺 handler 只运行一次。

## 状态流转

```txt
pending
  -> running
  -> completed

pending
  -> running
  -> pending
  -> running
  -> failed
```

状态说明：

- `pending`：等待执行或等待重试。
- `running`：已被 worker 领取，lease 未过期。
- `completed`：执行成功。
- `failed`：达到最大重试次数后失败。

## Cron 投递

`cron` 配置写在 `.job.ts` 中：

```ts
export default defineJob({
  cron: [
    {
      expression: '*/5 * * * *',
      timezone: 'Asia/Shanghai',
      payload: {
        source: 'cron',
      },
    },
  ],
  async handler() {},
})
```

cron 表达式初版支持 5 字段格式：

```txt
minute hour dayOfMonth month dayOfWeek
```

定时规则匹配后，scheduler 插入一条普通 pending Job。多 scheduler 实例并发运行时，通过唯一索引避免重复插入。

`cron_key` 由 `job_path`、表达式、timezone、queue 和静态 payload 计算得到，不要求用户手写名称。

## Plugin 与配置

`.job.ts` 应该像 `.api.ts` 一样支持 FaasJS plugin 生命周期。

加载 Job 文件时，`@faasjs/jobs` 使用 `loadPackage(file, 'default')` 加载 default export，并使用 `loadPlugins` 按当前 Job 文件路径解析 `faas.yaml` 配置。

区别是：

- `defineApi` 要求 `http` plugin。
- `defineJob` 不要求 `http` plugin。
- Job handler 运行时由 jobs 系统注入 `payload`、`client`、`logger`、`job` 等字段。

## Handler 入参

```ts
type DefineJobData<TPayload> = {
  payload: TPayload
  client: Client
  logger: Logger
  job: JobRecord
  attempt: number
}
```

`client` 是 `@faasjs/pg` 的 `Client`，由 `@faasjs/jobs` 内部通过 `getClient()` 获取并注入给 handler。用户启动 worker、scheduler 或 enqueue 时不传 `client`。

## 推荐项目结构

```txt
src/
  pages/
    home/
      api/
        users/
          list.api.ts
  jobs/
    users/
      cleanup.job.ts
    emails/
      send.job.ts
    reports/
      index.job.ts
```

语义：

- `.api.ts`：同步 HTTP/API 入口。
- `.job.ts`：异步 Job 入口。
- `@faasjs/jobs`：PG 持久化、领取、重试、cron enqueue、worker 生命周期。

## 实施步骤

1. 从 `@faasjs/core` 删除现有 cron 代码、测试和导出。
2. 从 `Server` 删除 `cronJob` 配置和生命周期调用。
3. 新增 `packages/jobs` 包。
4. 实现 `defineJob`、Job 类型、payload schema 校验和 plugin 加载。
5. 实现 `.job.ts` 自动发现和 `job_path` 解析。
6. 实现 `enqueueJob`，内部使用 `getClient()`。
7. 实现 jobs 表 schema 初始化。
8. 实现 worker 领取、lease、完成、失败、重试。
9. 实现 scheduler cron 扫描和定时投递。
10. 增加 PGlite/Vitest 测试，覆盖 enqueue、worker、retry、missing job file、scheduler 去重。
11. 更新文档、最佳实践、模板和 changelog。

## Breaking Changes

- `@faasjs/core` 不再导出 `CronJob` 相关 API。
- `ServerOptions.cronJob` 删除。
- 进程内定时任务不再由 `Server.listen()` 自动启动。
- 用户需要改为 `.job.ts` + `@faasjs/jobs`。
- 定时任务逻辑需要拆成 cron 投递配置和 Job handler。
