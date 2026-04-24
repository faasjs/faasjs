# Logger 指南

当你需要在 FaasJS handler、middleware、cron job、server hooks 或独立 Node.js 脚本中写出易读的运行时日志时，请使用这份指南。

## 适用场景

- 在 middleware、plugins 或 cron jobs 中写日志
- 为 FaasJS server 增加请求、生命周期或失败日志
- 创建需要共享 logger 的独立脚本
- 给慢操作加计时
- 调整本地开发、CI 或生产环境的日志噪音等级

## 默认工作流

1. 当 FaasJS 已经提供 `logger` 时，复用注入的 `logger`。
2. 只有在独立脚本、adapter 或基础设施代码中，才创建 `new Logger('label')`。
3. 细节使用 `debug`，正常里程碑使用 `info`，降级路径使用 `warn`，失败使用 `error`。
4. label 保持简短且稳定，这样相关日志更容易一起扫描。
5. 对慢步骤使用 `time()` 和 `timeEnd()`。
6. 优先通过环境变量调节日志详细度，而不是去改日志调用点。

## 规则

### 1. 框架已提供 logger 时优先复用

- 在 FaasJS 运行时代码中，`logger` 往往已经是回调上下文的一部分。
- 复用它可以让 labels、计时和 transport 行为与运行时保持一致。
- 除非有非常明确的理由，否则不要在同一个请求或 cron 回调里再创建第二个 logger。

Middleware 示例：

```ts
import { useMiddleware } from '@faasjs/core'

export default useMiddleware((request, response, { logger }) => {
  logger.info('%s %s', request.method, request.url)

  response.end('ok')
})
```

Cron job 示例：

```ts
import { CronJob } from '@faasjs/core'

const job = new CronJob({
  expression: '0 * * * *',
  async handler({ logger }) {
    logger.info('run cleanup')
  },
})
```

### 2. 为独立代码创建带 label 的 logger

- 在 scripts、CLIs、build tools 或自定义 adapters 中使用 `new Logger('label')`。
- 一个好的 label 应该能说明日志来源，同时又不要太吵。
- 优先使用 `seed`、`typegen`、`server` 或 `sync:users` 这类 label。

```ts
import { Logger } from '@faasjs/node-utils'

const logger = new Logger('seed')

logger.info('start importing users')
logger.info('loaded config %o', { region: 'cn', dryRun: false })
```

### 3. 按语义选择日志级别

- `debug`：内部步骤、params、cache hit 等高噪音诊断信息
- `info`：启动、关闭、job 成功等预期生命周期消息
- `warn`：可恢复问题、fallback、跳过逻辑或异常状态
- `error`：需要关注的失败
- 手里已经有 `Error` 对象时，直接传给 `logger.error(error)`

优先这样写：

```ts
try {
  await syncUsers()
  logger.info('sync completed')
} catch (error) {
  logger.error(error)
}
```

而不是先把错误手动序列化成字符串。

### 4. 使用格式化字符串，而不是手工拼大串日志

- `Logger` 支持 format-style message，能让日志更紧凑、也更好读。
- 文本使用 `%s`，数字使用 `%d`，JSON 使用 `%j`，对象使用 `%o`。
- 这通常比手动字符串拼接或提前 `JSON.stringify()` 更清晰。

```ts
logger.debug('user=%s retries=%d payload=%j', user.id, retries, payload)
```

### 5. 用 `time()` 和 `timeEnd()` 给慢操作计时

- 对网络请求、数据库访问、文件 IO 或启动 hooks 使用 timer。
- timer key 保持稳定，并确保 `timeEnd()` 使用的是同一个 key。
- 如果 key 不存在，FaasJS 会输出 warning，因此 key 不匹配很容易发现。

```ts
logger.time('load-user', 'info')

const user = await loadUser(id)

logger.timeEnd('load-user', 'loaded user %s', user.id)
```

### 6. 通过环境变量调节输出

- `FaasLog=debug|info|warn|error` 设置最小日志级别
- `FaasLogMode=plain` 禁用 ANSI 颜色
- `FaasLogMode=pretty` 强制启用彩色终端输出
- `FaasLogSize=2000` 调整长的非错误日志截断阈值
- `FaasLogTransport=true|false` 开启或关闭共享 transport 转发

示例：

```bash
FaasLog=info npx vp test
FaasLog=debug FaasLogMode=plain node ./scripts/sync-users.ts
```

### 7. 只有确实需要日志转运时才使用 transport

- `Logger` 默认会把消息转发到共享 transport。
- 当你需要把日志批量发往其他系统时，再去使用 `getTransport()`。
- 如果你注册了 transport handlers，请在 shutdown 时 flush 它们，避免缓冲日志丢失。

```ts
import { getTransport } from '@faasjs/node-utils'

const transport = getTransport()

transport.register('shipper', async (messages) => {
  for (const message of messages) {
    await sendToRemote(message)
  }
})

process.on('SIGINT', async () => {
  await transport.stop()
  process.exit(0)
})
```

### 8. 不要记录 secrets 或完整敏感载荷

- 默认不要记录 token、cookie、session 内容、密码或原始请求体。
- 对 `debug` 日志尤其要谨慎，因为它们经常会出现在 CI 日志和事故报告里。
- 如果必须记录请求上下文，优先记录 ids、counts 和安全摘要。

## 评审清单

- 在可复用时，优先使用注入的 logger
- labels 简短、稳定且有意义
- 高噪音诊断信息使用 `debug` 而不是 `info`
- 捕获到的错误在可能时通过 `logger.error(error)` 记录
- 慢步骤使用了 `time()` 与 `timeEnd()`，且 key 保持一致
- 通过环境变量而不是改代码来调整日志详细度
- 没有记录 secrets 与敏感载荷
- transport 启用时，handlers 会在 shutdown 阶段调用 `stop()`

## 延伸阅读

- [@faasjs/node-utils package reference](/doc/node-utils/)
- [Logger](/doc/node-utils/classes/Logger.html)
- [getTransport](/doc/node-utils/functions/getTransport.html)
- [formatLogger](/doc/node-utils/functions/formatLogger.html)
- [useMiddleware](/doc/core/functions/useMiddleware.html)
- [CronJob](/doc/core/classes/CronJob.html)
- [ServerOptions](/doc/core/type-aliases/ServerOptions.html)
