# Node Utils 指南

当你需要 FaasJS 运行时引导、本地工具、配置解析或日志记录方面的 Node.js 专属辅助功能时，使用本指南。

## 适用场景

- 在 Node.js 中直接运行处理函数、CLI 或测试
- 读取分阶段的 `faas.yaml` 配置
- 动态加载插件、API 处理函数模块或包
- 注册生命周期或仪表化的运行时模块钩子
- 使用基于 Zod schema 的解析验证边界输入
- 设置自定义 Node 端日志器

## `@faasjs/node-utils` 提供的内容

- 配置加载：`loadConfig`
- API 加载：`loadApiHandler`、`loadPlugins`
- Node 模块引导：`loadPackage`、`registerNodeModuleHooks`、`resetRuntime`
- 文件系统包含检查：`isPathInsideRoot`（详见 [校验指南](./valid.md)）
- schema 解析：`parseSchemaValue`、`formatSchemaError`、`SchemaOutput`（详见 [校验指南](./valid.md)）
- 日志和日志投递：`Logger`、`formatLogger`、`getTransport`、`Transport`、`colorfy`

## 默认工作流

1. 将 `@faasjs/node-utils` 的导入保持在 Node-only 的入口点、测试、CLI 或适配器中。
2. 让 `Server` 或 `viteFaasJsServer()` 在它们从 FaasJS 应用根目录进行引导时自动加载项目的 `.env`，在 `faas run` 入口文件、普通 Node 脚本、测试或其他在这些辅助函数启动前读取环境变量的入口点中，自行调用 Node 内置的 `loadEnvFile()`。
3. 仅需要分阶段 `faas.yaml` 数据时使用 `loadConfig()`。
4. 在自定义工具中需要原始 FaasJS YAML 子集且无需分阶段发现时使用 `parseYaml()`（来自 `@faasjs/utils`，详见 [YAML 指南](./yaml.md)）。
5. 需要最终导出的处理函数时使用 `loadApiHandler()`，或已有 `Func` 实例时使用 `loadPlugins()`。
6. 当直接 Node 执行必须理解本地 TypeScript 文件或 tsconfig 别名时，优先使用 FaasJS TypeScript 加载器，并保持本地导入不带 `.ts` 或 `.tsx` 后缀。
7. 在从用户控制或 URL 派生路径读取或加载根作用域文件之前，使用 `isPathInsideRoot()`（详见 [校验指南](./valid.md)）。
8. 对需要与 FaasJS API 和任务相同的可选 Zod schema 解析和错误格式化的自定义 Node 端边界，使用 `parseSchemaValue()`（详见 [校验指南](./valid.md)）。
9. 复用 `Logger` 和共享传输，而不是构建自定义日志包装器。

## 规则

### 1. 将 `node-utils` 保持在 Node-only 的代码路径中

- 此包依赖 Node API，如 `node:module`、`node:process` 和文件系统访问。
- 不要将其导入浏览器代码、React 组件或必须在边缘运行时上运行的代码。
- 对可移植辅助函数使用 `@faasjs/utils`，对框架/运行时原语使用 `@faasjs/core` 或 `@faasjs/dev`。

### 2. 当入口点需要 `.env` 文件时尽早加载

- `@faasjs/core` 的 `Server` 和 `@faasjs/dev` 的 `viteFaasJsServer()` 在从 FaasJS 应用根目录启动时，已经在处理函数运行前尝试加载项目的 `.env`。
- `node:process` 的 `loadEnvFile()` 仍然是 `faas run` 入口文件、本地脚本、测试、CLI 以及在这些辅助函数启动前读取 `process.env` 的配置文件的直接入口点。
- 在读取 `process.env`、构建配置对象或加载依赖环境值的模块之前调用它。
- 当你的引导程序在 `new Server(...)` 之前执行工作，或者同一个文件可以通过 `faas run` 运行时，在 `server.ts` 中保持显式的 `loadEnvFile()` 仍然是一个好的默认做法。
- 当环境文件是可选的且启动应在没有它的情况下继续时，将其包裹在 `try/catch` 中。

```ts
import { loadEnvFile } from 'node:process'

try {
  loadEnvFile()
} catch (error) {
  console.warn('Failed to load env file', error)
}
```

### 3. 让 `loadConfig()` 解析分阶段的 `faas.yaml`

- 不要为 `faas.yaml` 重新实现目录遍历或手动深度合并。
- `loadConfig()` 从项目根目录遍历到目标 API 目录，合并嵌套文件，应用 `defaults`，并用解析后的 `name` 注释插件条目。
- 这使运行时行为与 FaasJS 插件加载保持一致。

```ts
import { loadConfig } from '@faasjs/node-utils'

const config = loadConfig(process.cwd(), '/project/src/orders/create.api.ts', 'production')

console.log(config.plugins?.http)
```

### 4. 为任务选择最小的加载器

- 当需要分阶段 `faas.yaml` 解析（目录遍历和合并）时使用 `loadConfig()`。
- 当你需要运行时或测试将调用的最终处理函数时，使用 `loadApiHandler()`。
- 当你已经有 `Func` 实例并希望在导出或挂载之前附加 YAML 驱动的插件和配置时，使用 `loadPlugins()`。
- 在 Node.js 中进行默认导出的动态模块加载时使用 `loadPackage()`，尤其是当目标是本地 TypeScript 文件或路径别名感知模块时。
- 优先使用这些辅助函数而不是临时的 `import()` 包装器，以保持缓存清除、tsconfig 解析和插件连接的一致性。

```ts
import { loadEnvFile } from 'node:process'
import { loadApiHandler } from '@faasjs/node-utils'

loadEnvFile()

const handler = await loadApiHandler(
  process.cwd(),
  '/project/src/orders/create.api.ts',
  process.env.FaasEnv || 'development',
)

const result = await handler(event, context)
```

### 5. 仅在进程引导时注册模块钩子

- `registerNodeModuleHooks()` 适用于长期运行的 Node 入口点，如 CLI、开发服务器或需要 tsconfig 路径别名解析的引导脚本。
- 对于直接的 Node 执行，优先使用预加载入口 `node --import @faasjs/node-utils/register-hooks <entry>`，以便脚本保持标准的无扩展本地导入。
- 在启动附近调用一次。重复调用是安全的，但将其分散在模块中会使启动意图更难理解。
- 在依赖全新加载器状态的隔离测试中，在用例之间调用 `resetRuntime()`，而不是重新初始化整个进程。

```ts
import { registerNodeModuleHooks } from '@faasjs/node-utils'

registerNodeModuleHooks({
  root: process.cwd(),
})

await import('./scripts/sync-users')
```

### 6. 在共享原语上保持 Node 端日志记录

- 使用 `Logger` 进行结构化级别、标签、计时器和环境驱动的详细程度控制。
- 仅在日志需要缓冲并转发到另一个接收器时使用 `getTransport()`。
- `colorfy()` 和 `formatLogger()` 是较低级别的辅助函数；除非你正在实现日志基础设施，否则优先使用 `Logger` 类。

### 7. 为自定义 Node 边界使用 schema 辅助函数

详见 [校验指南](./valid.md) 了解 `parseSchemaValue`、`formatSchemaError` 和 `SchemaOutput` 的用法。

### 8. 使用 `isPathInsideRoot()` 验证根作用域文件路径

详见 [校验指南](./valid.md) 了解 `isPathInsideRoot` 的用法。

## 审查清单

- `@faasjs/node-utils` 导入保持在 Node-only 代码中
- `faas run` 入口文件和本地脚本在依赖环境变量的引导逻辑之前加载 `.env`，除非 `Server` 或 `viteFaasJsServer()` 完全拥有该引导过程
- 分阶段 `faas.yaml` 通过 `loadConfig()` 或 `loadApiHandler()` 读取，而不是自定义合并代码
- 加载器使用 `loadApiHandler()`、`loadPlugins()` 或 `loadPackage()`，而不是自定义动态导入包装器
- 模块钩子在进程启动时注册，而不是在特性代码深处
- 自定义 Node 端边界验证使用 `parseSchemaValue()`（详见 [校验指南](./valid.md)）
- 根作用域文件访问使用 `isPathInsideRoot()` 验证解析后的路径（详见 [校验指南](./valid.md)）
- 依赖全新加载器状态的测试使用 `resetRuntime()`
- 日志记录使用 `Logger` 或共享传输，而不是原始的 `console` 包装器

## 延伸阅读

- [Logger 指南](./logger.md)
- [校验指南](./valid.md)
- [@faasjs/node-utils 包参考](/doc/node-utils/)
- [loadConfig](/doc/node-utils/functions/loadConfig.html)
- [parseYaml](/doc/node-utils/functions/parseYaml.html)
- [loadApiHandler](/doc/node-utils/functions/loadApiHandler.html)
- [loadPlugins](/doc/node-utils/functions/loadPlugins.html)
- [loadPackage](/doc/node-utils/functions/loadPackage.html)
- [parseSchemaValue](/doc/node-utils/functions/parseSchemaValue.html)
- [Logger](/doc/node-utils/classes/Logger.html)
