# Logger 指南

在 FaasJS 应用中使用 `Logger` 实例、日志级别、计时和传输配置时，使用本指南。

## 适用场景

- 在中间件、插件或后台任务中记录日志
- 为 FaasJS 服务器添加请求、生命周期或失败日志
- 创建需要共享日志器的独立脚本
- 对慢操作进行计时
- 调整日志详细程度以进行调试

## 默认工作流

1. 当 FaasJS 已经提供日志器时，复用注入的 `logger`。
2. 仅为独立脚本、适配器或基础设施代码创建 `new Logger('label')`。
3. 使用 `debug` 记录细节，`info` 记录正常里程碑，`warn` 记录降级路径，`error` 记录失败。
4. 保持标签简短稳定，使相关日志易于扫描。
5. 在慢步骤周围使用 `time()` 和 `timeEnd()`。
6. 在更改日志调用点之前，使用环境变量更改详细程度。

## 规则

### 1. 优先使用框架提供的注入日志器

- 在 FaasJS 运行时代码中，`logger` 通常已经是回调上下文的一部分。
- 复用该日志器，使标签、计时和传输行为与运行时保持一致。
- 不要在同一请求或任务处理函数内部创建第二个日志器，除非有非常特殊的原因。

中间件示例：

```ts
import { useMiddleware } from '@faasjs/core'

export default useMiddleware((request, response, { logger }) => {
  logger.info('%s %s', request.method, request.url)

  response.end('ok')
})
```

任务处理函数示例：

```ts
import { defineJob } from '@faasjs/jobs'

export default defineJob({
  async handler({ logger }) {
    logger.info('run cleanup')
  },
})
```

### 2. 为独立代码创建带标签的日志器

- 在脚本、CLI、构建工具或自定义适配器中使用 `new Logger('label')`。
- 好的标签能说明日志来源，且不会变得嘈杂。
- 优先使用如 `seed`、`typegen`、`server` 或 `sync:users` 这样的标签。

```ts
import { Logger } from '@faasjs/node-utils'

const logger = new Logger('seed')

logger.info('start importing users')
logger.info('loaded config %o', { region: 'cn', dryRun: false })
```

### 3. 按意图选择级别

- `debug`：内部步骤、参数、缓存命中和其他嘈杂的诊断信息
- `info`：预期的生命周期消息，如启动、关闭和成功的任务
- `warn`：可恢复的问题、回退、跳过的工作或异常状态
- `error`：需要关注的失败
- 当有 `Error` 对象时，直接传递给 `logger.error(error)`

优先这样做：

```ts
try {
  await syncUsers()
  logger.info('sync completed')
} catch (error) {
  logger.error(error)
}
```

而不是先手动将错误字符串化。

### 4. 使用格式化字符串而不是手动构建大字符串

- `Logger` 支持格式风格的消息，使日志保持简洁可读。
- 使用 `%s` 表示文本，`%d` 表示数字，`%j` 表示 JSON，`%o` 表示检查的对象。
- 这通常比手动拼接或急切的 `JSON.stringify()` 更清晰。

```ts
logger.debug('user=%s retries=%d payload=%j', user.id, retries, payload)
```

### 5. 使用 `time()` 和 `timeEnd()` 对慢操作计时

- 对网络调用、数据库工作、文件 IO 或启动钩子使用计时器。
- 保持计时器键稳定，并确保 `timeEnd()` 使用相同的键。
- 如果键缺失，FaasJS 会记录警告，因此不匹配很容易发现。

```ts
logger.time('load-user', 'info')

const user = await loadUser(id)

logger.timeEnd('load-user', 'loaded user %s', user.id)
```

### 6. 使用环境变量调整输出

- `FaasLog=debug|info|warn|error` 设置最低级别
- `FaasLogMode=plain` 禁用 ANSI 颜色
- `FaasLogMode=pretty` 强制彩色终端输出
- `FaasLogSize=2000` 更改长非错误日志的截断阈值
- `FaasLogTransport=true|false` 启用或禁用共享传输转发

示例：

```bash
FaasLog=info npx vp test
FaasLog=debug FaasLogMode=plain node ./scripts/sync-users.ts
```

### 7. 仅在真正需要日志投递时使用传输

- `Logger` 默认将消息转发到共享传输。
- 当需要将日志批量发送到另一个系统时，使用 `getTransport()`。
- 如果注册了传输处理函数，请在关闭期间刷新它们，以免缓冲的日志丢失。

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

### 8. 不要记录密钥或完整的敏感负载

- 默认情况下避免记录令牌、cookie、会话内容、密码或原始请求体。
- 对 `debug` 日志要格外小心，因为它们通常会保留在 CI 日志和事故报告中。
- 如果必须记录请求上下文，优先使用 ID、计数和安全摘要。

## 审查清单

- 在可用时复用注入的日志器
- 标签简短、稳定且有意义的
- `debug` 用于嘈杂的诊断信息而不是 `info`
- 捕获的错误尽可能使用 `logger.error(error)` 记录
- 慢步骤使用 `time()` 和 `timeEnd()` 并匹配键
- 使用环境变量更改详细程度
- 不记录密钥和敏感负载
- 启用传输时，传输处理函数在关闭期间调用 `stop()`

## 延伸阅读

- [@faasjs/logger 包参考](/doc/logger/)
- [Logger](/doc/logger/classes/Logger.html)
- [getTransport](/doc/logger/functions/getTransport.html)
- [formatLogger](/doc/logger/functions/formatLogger.html)
