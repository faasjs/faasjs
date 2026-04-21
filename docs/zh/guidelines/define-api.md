# defineApi 指南

在实现或评审 FaasJS HTTP endpoint 时，默认优先使用 `defineApi`。

## 适用场景

- 创建新的 `.api.ts` API 模块
- 评审请求校验、错误处理、返回结构或注入的 HTTP helpers
- 更新需要保持与 Faas action 生成类型兼容的路由

## 默认工作流

1. 导出 `export default defineApi(...)`。
2. 除非 schema 会复用，否则把 `schema` 直接写在 `defineApi` 内。
3. 除非已存在可复用边界，否则让业务逻辑直接写在 `handler({ params })` 中。
4. 除非确实需要协议层控制，否则直接返回业务数据。
5. 创建、重命名或移动 API 文件后，运行 `faas types` 更新 `src/.faasjs/types.d.ts`。
6. 使用 `testApi(api)(data, options?)` 添加聚焦测试。

## 最小示例

```ts
import { defineApi, z } from '@faasjs/core'

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

### 1. 默认内联定义 schema

- 优先直接在 `defineApi` 内定义 `schema`。
- 只有在 schema 会复用、跨文件共享，或明显提升可读性时，才抽成单独常量。
- 把 `schema` 视为外部输入的单一事实来源。

优先这样写：

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

不要在没有复用理由时过早抽出 `schema`。

### 2. 用 `params` 承载业务输入

- `defineApi` 会校验解析后的请求参数，并把类型化结果传给 `handler`。
- `params` 是 `event.params` 经过解析与校验后的视图。
- `event` 保留原始请求载荷；只有在需要协议层细节或未解析输入时才去读取它。
- 业务逻辑优先使用 `params`，不要直接读原始请求字段。
- 只有协议层行为相关时，才读取 `event`、`headers` 或 `body`。
- 让 `schema` 负责边界上的请求结构校验；进入 `handler` 后，如果领域状态不合法，应快速失败，而不是叠加静默 fallback 分支。

### 3. 默认抛出 `Error`

- 对普通业务失败或面向用户的失败，优先使用 `throw Error(message)`。
- 普通 `Error` 会把消息保留在 JSON 错误体中，并返回 HTTP `500`。
- 只有在你需要控制 `statusCode` 或其他 HTTP 级行为时，才使用 `HttpError`。
- 如果客户端协议明确依赖某个非 `500` 状态码，就显式使用 `HttpError`。
- 能让 Zod 处理的请求结构错误，就不要自己再重复处理。

响应行为摘要：

- `throw Error('message')` -> 返回带 message 的 JSON 错误响应，状态码为 `500`
- `throw new HttpError({ statusCode: 409, message: 'message' })` -> 返回带 message 的 JSON 错误响应，状态码为 `409`

示例：

```ts
import { defineApi, HttpError, z } from '@faasjs/core'

export default defineApi({
  schema: z.object({
    title: z.string().min(1),
    price: z.number().positive(),
    quantity: z.number().int().positive().default(1),
  }),
  async handler({ params }) {
    if (params.title === 'duplicate') {
      throw Error('Order title already exists')
    }

    if (params.title === 'conflict') {
      throw new HttpError({
        statusCode: 409,
        message: 'Order title conflicts with an existing resource',
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

- 返回普通值或对象就是常规路径。
- HTTP 层会把它序列化成 JSON 响应。
- 只有在确实需要协议层控制时，才使用 `setHeader`、`setStatusCode`、`setContentType` 或 `setBody`。
- 如果 handler 没有返回值，且也没有设置 body，响应可能会变成 `204`。

### 5. 记住可用的 HTTP 注入 helpers

`defineApi` 的 handler 一定会收到：

- `params`
- `event`

启用 HTTP plugin 后，handler 还可能收到这些 HTTP 相关字段：

- `cookie`
- `session`
- `headers`
- `body`
- `setHeader`
- `setContentType`
- `setStatusCode`
- `setBody`

只有 endpoint 真的需要它们时才使用。

### 6. 为 plugin 注入字段补上类型

如果 plugin 注入了额外字段，比如 `current_user`，请扩展 `DefineApiInject`，让 handler 保持类型安全。

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

### 7. 改动 API 后运行类型生成

创建、重命名或移动 `.api.ts` 文件后，运行：

```bash
faas types
```

请在你的 FaasJS 应用根目录执行，并使用该应用配置好的 FaasJS CLI。

它会更新：

```text
src/.faasjs/types.d.ts
```

在交付改动前完成这一步，确保路由到类型的映射保持同步。

## 测试清单

先遵循共享的 [测试指南](./testing.md)，再使用 `@faasjs/dev` 覆盖：

- success path
- invalid params -> `400`
- plain `Error` -> `500`，并带上预期 message
- 使用 `HttpError` 时的特殊 HTTP 错误行为
- unexpected error -> `500`
- 使用 cookie / session 时的相关行为

示例：

```ts
import { testApi } from '@faasjs/dev'
import { describe, expect, it } from 'vite-plus/test'

import api from '../create.api'

describe('orders/api/create', () => {
  const handler = testApi(api)

  it('returns 400 when params are invalid', async () => {
    const response = await handler({
      title: '',
      price: -1,
      quantity: 1,
    })

    expect(response.statusCode).toBe(400)
    expect(response.error?.message).toContain('Invalid params')
  })

  it('returns 500 for plain Error', async () => {
    const response = await handler({
      title: 'duplicate',
      price: 10,
      quantity: 1,
    })

    expect(response.statusCode).toBe(500)
    expect(response.error?.message).toBe('Order title already exists')
  })

  it('returns custom status for HttpError', async () => {
    const response = await handler({
      title: 'conflict',
      price: 10,
      quantity: 1,
    })

    expect(response.statusCode).toBe(409)
    expect(response.error?.message).toBe('Order title conflicts with an existing resource')
  })
})
```

## 延伸阅读

- [测试指南](./testing.md)
- [defineApi API reference](/doc/core/functions/defineApi.html)
- [DefineApiData](/doc/core/type-aliases/DefineApiData.html)
- [DefineApiOptions](/doc/core/type-aliases/DefineApiOptions.html)
- [HttpError](/doc/core/classes/HttpError.html)
- [testApi](/doc/dev/functions/testApi.html)
- [ApiTester](/doc/dev/classes/ApiTester.html)
- [generateFaasTypes](/doc/dev/functions/generateFaasTypes.html)
