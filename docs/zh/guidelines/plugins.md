# Plugins 指南

当需要添加在每个请求之前或之后运行的横切关注点行为时——例如身份验证、租户解析、请求日志记录、速率限制或功能开关——请使用本指南。插件会挂载到 FaasJS 请求生命周期中，并可将类型化的字段注入到 `defineApi` 和 `defineJob` 处理函数中。

## 适用场景

- 将 `current_user`、租户上下文或请求元数据注入到每个处理函数中
- 添加请求级别的日志记录、追踪或计时
- 在业务处理函数运行之前验证身份令牌、API 密钥或权限
- 通过共享层控制响应形态（头信息、响应体、状态码）
- 使用设置和清理逻辑包裹每个请求（例如开启事务、清除缓存）

## 插件工作原理

FaasJS 插件遵循 Koa 风格的中间件模型。每个插件都有一个 `type`（来源标识）和一个 `name`（运行时实例 ID）。插件按注册顺序执行：

1. `onMount`：每个 `Func` 实例在首次请求之前运行一次。用于初始化连接、合并配置或验证前置条件。
2. `onInvoke`：在每个请求上运行。插件接收一个在整个链中共享的可变 `InvokeData` 对象。使用 `await next()` 继续执行下一个插件或业务处理函数。

内置的 `RunHandler` 插件始终最后运行，并调用业务处理函数。用户插件始终在其之前执行。

## 默认工作流

1. 确定插件是一次性的（内联在特定 API 中）还是可复用的（跨端点共享）。
2. 对于可复用插件，在项目中创建一个 `plugins/` 目录（例如 `src/plugins/auth.ts`）。
3. 实现 `Plugin` 接口，包含 `type`、`name` 和至少一个生命周期方法（`onMount` 或 `onInvoke`）。
4. 通过在调用 `await next()` 之前修改 `data` 来注入字段。
5. 为 `DefineApiInject` 添加 TypeScript 声明合并，使处理函数可以看到类型化的注入字段。
6. 通过 `faas.yaml`（配置驱动）或直接在代码中（在 `Func` 或 `defineApi` 上）注册插件。

## 规则

### 1. 正确实现 Plugin 接口

每个插件必须将 `type` 和 `name` 暴露为只读字符串，并实现至少一个生命周期方法。

```ts
import type { InvokeData, MountData, Next, Plugin } from '@faasjs/core'

class AuthPlugin implements Plugin {
  public readonly type = 'auth'
  public readonly name = 'auth'

  public async onMount(data: MountData, next: Next) {
    // 运行一次：加载密钥，验证配置
    await next()
  }

  public async onInvoke(data: InvokeData, next: Next) {
    // 在每个请求上运行：解析当前用户
    data.current_user = { id: 1, name: 'FaasJS' }
    await next()
  }
}
```

- `type` 标识插件来源或模块，而非运行时实例。
- `name` 是运行时身份标识，必须保持稳定——它用于排序、去重、配置查找和日志记录。
- 当插件没有配置驱动的变体时，`name` 和 `type` 可以相同。

### 2. 通过修改 `InvokeData` 来注入字段

插件共享一个可变 `InvokeData` 对象。在调用 `next()` 之前向其中添加字段，以便下游插件和业务处理函数可以接收到它们。

```ts
public async onInvoke(data: InvokeData, next: Next) {
  data.current_user = await resolveUser(data.event.headers?.authorization)
  data.requestId = crypto.randomUUID()
  await next()
}
```

- 优先直接向 `data` 添加字段，而非使用 `context`——`context` 用于框架内部机制。
- 不要将 `data` 包装在另一个对象中；在顶层添加字段，以便处理函数可以直接访问它们。

### 3. 通过 `DefineApiInject` 模块增强提供类型

当插件作者通过 TypeScript 模块增强声明注入字段时，处理函数会获得类型化的注入字段。

```ts
import type { InvokeData, Next, Plugin } from '@faasjs/core'

declare module '@faasjs/core' {
  interface DefineApiInject {
    current_user?: {
      id: number
      name: string
      roles: string[]
    } | null
  }
}
```

这使得 `defineApi` 处理函数可以引用 `current_user` 并拥有完整的类型安全：

```ts
export default defineApi({
  async handler({ current_user }) {
    // current_user 类型为 { id: number; name: string; roles: string[] } | undefined | null
    if (!current_user) throw new HttpError({ statusCode: 401, message: '未认证' })
    return { user: current_user }
  },
})
```

### 4. 使用 `onMount` 进行一次性初始化

`onMount` 在每个 `Func` 实例的首次 `onInvoke` 之前运行一次。用于：

- 加载密钥、证书或远程配置
- 验证插件的前置条件是否满足
- 将 `faas.yaml` 配置合并到插件实例中
- 打开持久连接

```ts
class DatabasePlugin implements Plugin {
  public readonly type = 'db'
  public readonly name = 'db'
  public config?: DbConfig
  private pool?: Pool

  public async onMount(data: MountData, next: Next) {
    // 将 YAML 配置合并到 this.config 中
    if (data.config.plugins?.[this.name]?.config) {
      this.config = { ...data.config.plugins[this.name].config }
    }
    this.pool = await createPool(this.config?.connectionString)
    await next()
  }
}
```

- `onMount` 按插件顺序运行且最多运行一次。
- 来自 `faas.yaml` 的配置在 `onMount` 期间可通过 `data.config.plugins[name]` 获取。

### 5. 通过 `faas.yaml` 注册插件以实现配置驱动的加载

推荐通过 `faas.yaml` 配置可复用插件。这样可以保持插件配置的声明式风格，并支持目录级别的覆盖。

```yaml
# src/faas.yaml
defaults:
  plugins:
    http:
      type: http
      config:
        cookie:
          secure: false
    auth:
      type: file://./plugins/auth.ts
      config:
        provider: jwt
        secret: ${AUTH_SECRET}
```

`faas.yaml` 中的插件条目以插件 `name` 为键。每个条目需要：

- `type`：解析插件模块。本地插件文件使用 `file://`，裸名称（例如 `auth`）用于 `@faasjs/<type>` 包，作用域名称用于 npm 包。
- `config`：传递给插件实例的可选配置。

对于内置插件，`type` 可以省略：

- `http` 自动解析为 `@faasjs/core`。

### 6. 在代码中注册插件用于一次性或程序化场景

对于特定于单个 API 或需要程序化构建的插件，可以直接传递给 `Func` 或 `defineApi`。

```ts
import { Func, type InvokeData, type Next, type Plugin } from '@faasjs/core'

class TracePlugin implements Plugin {
  public readonly type = '@/plugins/trace'
  public readonly name = 'trace'

  public async onInvoke(data: InvokeData, next: Next) {
    const start = Date.now()
    await next()
    data.logger.debug('请求耗时 %dms', Date.now() - start)
  }
}

export default new Func({
  plugins: [new TracePlugin()],
  async handler({ context }) {
    return { ok: true }
  },
})
```

对于 `defineApi`，将插件添加到 `api.plugins` 中（在 `RunHandler` 之前）：

```ts
const api = defineApi({
  async handler({ context }) {
    return { loaded: context.sharedLoaded }
  },
})

api.plugins.unshift(new SharedPlugin())
```

- 手动插件数组不执行隐式去重。
- 当同一 `name` 的插件同时存在于代码中和 `faas.yaml` 配置中时，现有的代码实例被复用，并通过 `applyConfig` 或深度合并接收合并后的配置。

### 7. 理解配置合并与优先级

插件配置可以来自三个来源，按以下顺序合并：

1. **项目根目录 `faas.yaml`**——基线配置
2. **更深层目录的 `faas.yaml`**——作用域级别的覆盖（深度合并，更深层目录获胜）
3. **代码编写的配置**——`api.config.plugins[name]` 上的内联配置（最高优先级）

```
faas.yaml 根目录  →  faas.yaml 更深层  →  代码配置（获胜）
```

真实场景示例：

```yaml
# src/faas.yaml
defaults:
  plugins:
    auth:
      type: file://./plugins/auth.ts
      config:
        provider: jwt
        secret: base-secret
```

```yaml
# src/admin/faas.yaml
defaults:
  plugins:
    auth:
      config:
        secret: admin-secret
```

```ts
api.config = {
  plugins: {
    auth: { config: { secret: 'code-secret' } },
  },
}
```

解析后的配置：`provider` 保持为 `'jwt'`（来自根目录），`secret` 变为 `'code-secret'`（代码配置覆盖两个 YAML 层）。

### 8. 实现 `applyConfig` 以自定义配置合并

当插件需要超出深度合并的自定义合并逻辑时，实现 `applyConfig`。此方法在 YAML 分层之后、`onMount` 之前接收插件 `name` 的最终解析配置。

```ts
class AuthPlugin implements Plugin {
  public readonly type = 'auth'
  public readonly name = 'auth'
  public config: Record<string, any> = {}

  public applyConfig(config: { type: string; name: string; config?: Record<string, any> }) {
    // 自定义合并逻辑
    this.config = {
      provider: config.config?.provider || 'jwt',
      secret: config.config?.secret || process.env.AUTH_SECRET,
    }
  }
}
```

- 仅当插件在代码中注册且在 `faas.yaml` 中存在其 `name` 的配置时，才会调用 `applyConfig`。
- 如果你不实现 `applyConfig`，加载器会自动将 `config.config` 深度合并到 `plugin.config` 中。

### 9. 每个生命周期钩子仅调用 `next()` 一次

生命周期链依赖于 `await next()`。在同一个钩子中多次调用会导致 `next() called multiple times` 错误。

```ts
// 正确：仅调用 next() 一次
public async onInvoke(data: InvokeData, next: Next) {
  data.logger.debug('调用前')
  await next()
  data.logger.debug('调用后')
}

// 错误：这将抛出异常
public async onInvoke(data: InvokeData, next: Next) {
  await next()
  await next() // 拒绝: "next() called multiple times"
}
```

- 用设置/清理逻辑包裹 `next()`——`next()` 之前的代码在请求进入时运行，`next()` 之后的代码在请求结束返回时运行。
- 链中位于你插件之后的插件（包括业务处理函数）在你的 `next()` 调用期间执行。

### 10. 使用真实的 `Func` 实例测试插件

通过真实的 `Func` 或 `defineApi` 测试插件，以演练完整的生命周期。

```ts
import { Func, type InvokeData, type Next, type Plugin } from '@faasjs/core'
import { describe, expect, it } from 'vitest'

class TestPlugin implements Plugin {
  public readonly type = 'test'
  public readonly name = 'test'

  public async onInvoke(data: InvokeData, next: Next) {
    data.injected = 'value'
    await next()
  }
}

describe('TestPlugin', () => {
  it('将字段注入到处理函数数据中', async () => {
    const func = new Func({
      plugins: [new TestPlugin()],
      handler: ({ injected }) => ({ injected }),
    })
    const result = await func.invoke({})
    expect(result.injected).toBe('value')
  })

  it('包裹处理函数执行', async () => {
    const callOrder: string[] = []
    class WrapPlugin implements Plugin {
      public readonly type = 'wrap'
      public readonly name = 'wrap'
      public async onInvoke(_data: InvokeData, next: Next) {
        callOrder.push('调用前')
        await next()
        callOrder.push('调用后')
      }
    }
    const func = new Func({
      plugins: [new WrapPlugin()],
      handler: () => {
        callOrder.push('处理函数')
        return {}
      },
    })
    await func.invoke({})
    expect(callOrder).toEqual(['调用前', '处理函数', '调用后'])
  })
})
```

对于 `defineApi` 插件，使用 `@faasjs/dev` 中的 `testApi`：

```ts
import { testApi } from '@faasjs/dev'
import { describe, expect, it } from 'vitest'

import api from '../create.api'

describe('带 auth 插件的创建操作', () => {
  const handler = testApi(api)

  it('无用户时返回 401', async () => {
    const response = await handler({ title: 'test' })
    expect(response.statusCode).toBe(401)
  })
})
```

## 插件与其他机制的对比

| 需求                             | 使用方式           | 原因                                                 |
| -------------------------------- | ------------------ | ---------------------------------------------------- |
| 认证、租户、请求元数据、日志记录 | 插件               | 在每个请求上运行，状态注入到处理函数数据中           |
| 输入验证                         | API 中的 `schema`  | `defineApi` 中的 Zod schema 在边界处验证参数         |
| 业务逻辑                         | API 中的 `handler` | 处理函数接收类型化的参数和注入字段                   |
| 处理函数内的数据库访问           | `getClient()`      | 在处理函数内部，调用 `@faasjs/pg` 中的 `getClient()` |
| 每个请求的一次性数据处理         | 处理函数内联       | 将一次性逻辑保留在处理函数中，除非影响多个端点       |
| 后台工作                         | `defineJob`        | 使用 jobs 处理不应当阻塞请求的异步工作               |
| HTTP 级别行为                    | 内置 `http` 插件   | 内置的 `http` 插件处理 cookie、session 和响应        |

## 审查清单

- 插件将 `type` 和 `name` 实现为只读字符串
- 插件实现了 `onMount`、`onInvoke` 或两者
- 插件通过 `DefineApiInject` 增强为处理函数提供类型化的注入字段
- 插件在 `faas.yaml` 中配置（可复用）或在代码中配置（一次性）
- 插件在每个生命周期钩子中仅调用 `next()` 一次
- 测试通过 `Func.invoke()` 或 `testApi()` 演练完整的生命周期
- 配置合并顺序遵循 YAML 分层然后代码优先级的规则
- 插件名称稳定且在同一个 `Func` 实例中不重复

## 进一步阅读

- [Plugin 规范](/doc/specs/plugin.html) — 插件身份标识、生命周期、配置分层和加载的完整规范
- [defineApi 指南](./define-api.md) — 带 schema 验证的 API 端点定义
- [Testing 指南](./testing.md) — 测试原则和 `testApi` 使用
- [Jobs 指南](./jobs.md) — 后台任务和 `defineJob`
- [faas.yaml 规范](/doc/specs/faas-yaml.html) — 完整的 YAML 配置参考
