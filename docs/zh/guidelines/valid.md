# 校验指南

当你在 FaasJS 项目中需要对数据进行校验时（无论是在系统边界、自定义 Node 端代码还是可移植辅助函数中），请参考本指南。

## 适用场景

- 使用扩展的 `z` 实例通过 Zod schema 验证数据
- 使用 `isObjectRecord` 等类型守卫收窄 `unknown` 类型
- 在 Node-only 代码中针对可选 Zod schema 解析和校验值
- 格式化 Zod 校验错误消息
- 验证文件路径是否在允许的根目录内

## `@faasjs/utils` 和 `@faasjs/node-utils` 提供的校验能力

- `z`（来自 `@faasjs/utils`）— 扩展的 Zod 实例，提供便捷辅助方法（`positiveint`、`nonemptystring`）
- `isObjectRecord`（来自 `@faasjs/utils`）— 检查值是否为纯对象的类型守卫
- `parseSchemaValue`（来自 `@faasjs/node-utils`）— 针对可选 Zod schema 解析和校验值
- `formatSchemaError`（来自 `@faasjs/node-utils`）— 格式化 Zod 校验错误消息而不抛出异常
- `SchemaOutput`（来自 `@faasjs/node-utils`）— 遵循 Zod schema 输出类型的工具类型
- `isPathInsideRoot`（来自 `@faasjs/node-utils`）— 验证路径是否在根目录内

## 常见模式

### 1. 使用 Zod schema 验证数据

在 FaasJS 项目中，使用 `z`（扩展的 Zod 实例）替代直接导入裸 `zod` 包。`z.positiveint()` 返回一个只允许正整数的模式。`z.nonemptystring()` 返回一个只允许非空字符串的模式。

```ts
import { z } from '@faasjs/utils'

const schema = z.object({
  name: z.nonemptystring(),
  age: z.positiveint(),
})
```

### 2. 使用 `isObjectRecord` 收窄未知类型

在泛型代码中使用 `isObjectRecord` 作为类型守卫，将 `unknown` 收窄为 `Record<string, unknown>`。

```ts
import { isObjectRecord } from '@faasjs/utils'

function process(value: unknown) {
  if (isObjectRecord(value)) {
    // value 被收窄为 Record<string, unknown>
    console.log(Object.keys(value))
  }
}
```

### 3. 为自定义 Node 边界使用 schema 辅助函数

`defineApi` 和 `defineJob` 已经解析它们自己的 schema，因此应用处理函数应使用它们注入的 `params`。当 CLI、工作器适配器、加载器或其他 Node-only 边界需要相同的可选 schema 行为时，使用 `parseSchemaValue`；省略的 schema 和空输入默认为 `{}`，除非传递 `defaultValue`。

当公共辅助函数类型应遵循 Zod schema 输出类型并在 schema 省略时回退时，使用 `SchemaOutput<TSchema, TFallback>`。

仅当需要格式化的验证消息而不抛出异常时，使用 `formatSchemaError`。

```ts
import { parseSchemaValue } from '@faasjs/node-utils'
import { z } from '@faasjs/utils'

const params = await parseSchemaValue({
  schema: z.object({
    count: z.coerce.number().int().positive(),
  }),
  value: input,
  errorMessage: 'Invalid params',
})
```

### 4. 使用 `isPathInsideRoot` 验证根作用域文件路径

在打开从请求 URL、CLI 参数、配置值或任何其他用户控制片段解析的文件之前，使用 `isPathInsideRoot`。

它会规范化两个路径，使用 `realpath` 跟踪现有符号链接，并通过规范化最近的现有父目录来处理缺失的目标文件。这使其适用于防护静态文件服务、路由查找、模板解析或任何必须拒绝 `../` 遍历和符号链接逃逸的逻辑。

先解析候选路径，然后针对预期的根目录验证该解析路径。

```ts
import { isPathInsideRoot } from '@faasjs/node-utils'
import { resolve } from 'node:path'

const root = resolve(process.cwd(), 'public')
const candidate = resolve(root, requestPath)

if (!isPathInsideRoot(candidate, root)) {
  throw Error('Path escapes the static root')
}
```

## 审查清单

- Zod schema 校验使用 `@faasjs/utils` 的 `z` 而非裸 `zod` 包，以保持一致性
- 类型守卫使用 `isObjectRecord` 而非临时的 `typeof` 检查来收窄 `unknown` 为 `Record`
- 自定义 Node 端边界校验使用 `parseSchemaValue` 而非一次性 Zod 错误格式化
- `formatSchemaError` 仅用于需要格式化消息而不抛出异常的场景
- 根作用域文件访问使用 `isPathInsideRoot` 验证解析后的路径

## 延伸阅读

- [@faasjs/utils 包参考](/doc/utils/)
- [isObjectRecord](/doc/utils/functions/isObjectRecord.html)
- [@faasjs/node-utils 包参考](/doc/node-utils/)
- [parseSchemaValue](/doc/node-utils/functions/parseSchemaValue.html)
- [formatSchemaError](/doc/node-utils/functions/formatSchemaError.html)
- [isPathInsideRoot](/doc/node-utils/functions/isPathInsideRoot.html)
- [Utils 指南](./utils.md)
- [Node Utils 指南](./node-utils.md)
