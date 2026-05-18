# defineApi 指南

在实现或审查 FaasJS HTTP 端点时，默认使用 `defineApi`。

## 适用场景

- 创建新的 `.api.ts` 模块
- 审查请求验证、错误处理或注入的辅助方法
- 文件变更后更新路由并重新生成类型

## 默认工作流

1. 导出 `default defineApi(...)`。
2. 当端点接受业务输入时，除非在其他地方复用了 schema，否则在 `defineApi` 中内联编写 `schema`。
3. 除非已存在共享边界，否则在 `handler({ params })` 内部直接编写业务逻辑。
4. 除非需要协议级别的响应控制，否则直接返回业务数据。
5. 创建、重命名或移动 API 文件后，运行 `faas types` 更新 `src/.faasjs/types.d.ts`。
6. 使用 `testApi(api)(data, options?)` 添加有针对性的测试。

## 最小示例

```ts
import { defineApi } from '@faasjs/core'
import { z } from '@faasjs/utils'

export default defineApi({
  schema: z.object({
    name: z.string().min(1).optional(),
  }),
  async handler({ params }) {
    return {
      message: `Hello, ${params.name || 'FaasJS'}!`,
    }
  },
})
```

## 规则

### 1. 使用 zod 进行输入验证，而非内部类型检查

- 在系统边界使用 zod 验证外部输入（用户参数、配置文件、API 载荷），这正是 `defineApi` 的 `schema` 的用途。
- 不要用 zod 替代内部控制流中使用的 `typeof`/`instanceof`/`=== null` 检查。这些谓词简洁、零开销且语义正确——zod 会增加代码和成本而无益处。
- Zod schema 会自动生成 TypeScript 类型，减少样板代码并使验证逻辑与类型定义保持同步。
- 优先在 `defineApi` 内部直接定义 `schema`。
- 仅当 schema 被复用、跨文件共享或显著提升可读性时，才将其提取为独立常量。
- 将 `schema` 视为外部输入的唯一事实来源。
- 如果端点没有业务输入，省略 `schema` 而非定义空的 `z.object({})`；此时 `params` 的类型将为 `Record<string, never>`。

优先这样：

```ts
export default defineApi({
  schema: z.object({
    id: z.coerce.number().int().positive(),
  }),
  async handler({ params }) {
    return params.id
  },
})
```

而非在无复用理由时过早提取 `schema`。

### 2. 使用 `params` 处理业务输入

- `defineApi` 验证解析后的请求参数，并将类型化结果传递给 `handler`。
- `params` 是 `event.params` 解析验证后的视图。
- `event` 保留原始请求载荷；仅在需要传输层细节或未解析输入时才使用它。
- 业务逻辑优先使用 `params` 而非原始请求字段。
- 仅在传输层行为重要时才读取 `event`、`headers` 或 `body`。
- 让 `schema` 在边界处覆盖请求形状的验证，然后在 `handler` 内部领域状态无效时快速失败，而不是添加额外的回退分支。

### 3. 谨慎选择错误状态码

- 尽可能让 Zod 验证处理请求形状的错误。
- 当失败是预期的客户端或业务结果，且调用方应看到非 `500` 状态码时，使用 `HttpError`。
- 对预期失败优先使用常见的明确状态码：`400` 表示 schema 未覆盖的无效业务输入，`401` 表示未认证请求，`403` 表示权限失败，`404` 表示缺少作用域资源，`409` 表示冲突。
- 对意外的内部失败或不变性违反，使用普通的 `throw Error(message)`。普通 `Error` 会将其消息保留在 JSON 错误体中，并以 HTTP `500` 响应。
- 不要将权限、租户或资源作用域失败隐藏在宽泛的回退响应之后。

响应行为总结：

- Zod schema 失败 -> 框架返回验证错误响应
- `throw new HttpError({ statusCode: 409, message: 'message' })` -> 返回包含消息和状态码 `409` 的 JSON 错误响应
- `throw Error('message')` -> 返回包含消息和状态码 `500` 的 JSON 错误响应

示例：

```ts
import { defineApi, HttpError } from '@faasjs/core'
import { z } from '@faasjs/utils'

export default defineApi({
  schema: z.object({
    title: z.string().min(1),
    price: z.number().positive(),
    quantity: z.number().int().positive().default(1),
  }),
  async handler({ params }) {
    if (params.title === 'duplicate') {
      throw new HttpError({
        statusCode: 409,
        message: 'Order title already exists',
      })
    }

    if (params.title === 'forbidden') {
      throw new HttpError({
        statusCode: 403,
        message: 'You cannot create this order',
      })
    }

    if (params.title === 'explode') throw Error('Unexpected failure')

    return {
      id: 'demo-order',
      title: params.title,
      total: params.price * params.quantity,
    }
  },
})
```

### 4. 默认直接返回业务数据

- 返回普通值或对象是常规路径。
- HTTP 层会将其序列化为 JSON 响应。
- 仅当确实需要协议级控制时，才使用 `setHeader`、`setStatusCode`、`setContentType` 或 `setBody`。
- 如果 handler 不返回任何内容且未设置 body，响应可能变为 `204`。

### 5. 记住注入的 HTTP 辅助方法

`defineApi` 的 handler 始终接收：

- `params`
- `event`

使用 HTTP 插件后，handler 还可以接收 HTTP 相关字段，包括：

- `cookie`
- `session`
- `headers`
- `body`
- `setHeader`
- `setContentType`
- `setStatusCode`
- `setBody`

仅在端点真正需要时才使用它们。

### 6. 支持插件注入字段的类型

如果插件注入了额外字段（如 `current_user`），扩展 `DefineApiInject` 以保持 handler 的类型安全。

```ts
declare module '@faasjs/core' {
  interface DefineApiInject {
    current_user?: {
      id: number
      name: string
    } | null
  }
}
```

### 7. 变更 API 后运行类型生成

创建、重命名或移动 `.api.ts` 文件后，运行：

```bash
faas types
```

在 FaasJS 应用根目录下，使用应用配置的 FaasJS CLI 执行此命令。

这会更新：

```text
src/.faasjs/types.d.ts
```

在交接变更前执行此操作，确保路由到类型的映射保持同步。

## 测试检查清单

先参考共享的[测试指南](./testing.md)，然后使用 `@faasjs/dev` 覆盖：

- 成功路径
- 无效参数 -> `400`
- 预期的业务、认证、权限、资源缺失或冲突错误（使用 `HttpError` 时）
- 意外的或不变性错误（使用普通 `Error`）-> `500` 并携带预期消息
- 使用 cookie/session 时的行为

示例：

```ts
import { testApi } from '@faasjs/dev'
import { describe, expect, it } from 'vite-plus/test'

import api from '../create.api'

describe('orders/api/create', () => {
  const handler = testApi(api)

  it('参数无效时返回 400', async () => {
    const response = await handler({
      title: '',
      price: -1,
      quantity: 1,
    })

    expect(response.statusCode).toBe(400)
    expect(response.error?.message).toContain('Invalid params')
  })

  it('预期冲突时返回 409', async () => {
    const response = await handler({
      title: 'duplicate',
      price: 10,
      quantity: 1,
    })

    expect(response.statusCode).toBe(409)
    expect(response.error?.message).toBe('Order title already exists')
  })

  it('意外内部失败时返回 500', async () => {
    const response = await handler({
      title: 'explode',
      price: 10,
      quantity: 1,
    })

    expect(response.statusCode).toBe(500)
    expect(response.error?.message).toBe('Unexpected failure')
  })
})
```

## 延伸阅读

- [测试指南](./testing.md)
- [defineApi](/doc/node-utils/functions/defineApi.html)
- [DefineApiOptions](/doc/node-utils/interfaces/DefineApiOptions.html)
- [HttpError](/doc/node-utils/classes/HttpError.html)
- [testApi](/doc/node-utils/functions/testApi.html)
- [ApiTester](/doc/node-utils/interfaces/ApiTester.html)
- [generateFaasTypes](/doc/dev/functions/generateFaasTypes.html)
