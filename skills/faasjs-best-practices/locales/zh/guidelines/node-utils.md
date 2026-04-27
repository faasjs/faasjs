# Node Utils 指南

当你需要用于 FaasJS 运行时引导、本地工具、配置解析或日志的 Node.js 专用 helpers 时，请使用这份指南。

## 适用场景

- 在 Node.js 中直接运行 FaasJS handler、CLI、测试或 bootstrap 脚本
- 读取某个函数文件对应的、已合并分阶段的 `faas.yaml` 配置
- 在自定义 Node.js 工具中解析 FaasJS 支持的 YAML 子集
- 把一个函数模块变成可运行的导出 handler
- 把 YAML 中定义的 plugins 加载到 `Func` 实例中
- 在原生 Node 环境中导入带有 tsconfig path alias 的本地 TypeScript 模块
- 校验候选文件路径在解析后是否仍然停留在允许的 root 目录内
- 复用运行时日志，或把日志发往 transport

## `@faasjs/node-utils` 提供什么

- 配置加载：`loadConfig`、`parseYaml`
- API 加载：`loadApiHandler`、`loadPlugins`
- Node 模块引导：`loadPackage`、`registerNodeModuleHooks`、`detectNodeRuntime`、`resetRuntime`
- 文件系统边界校验：`isPathInsideRoot`
- schema 解析：`parseSchemaValue`、`formatSchemaError`、`SchemaOutput`
- 日志与日志转运：`Logger`、`formatLogger`、`getTransport`、`Transport`、`colorfy`

## 默认工作流

1. 仅在 Node-only entrypoints、tests、CLIs 或 adapters 中导入 `@faasjs/node-utils`。
2. 当 `Server` 或 `viteFaasJsServer()` 从 FaasJS 应用根目录接管 bootstrap 时，让它们自动加载项目 `.env`；对于 `faas run` 入口文件、普通 Node 脚本、测试，以及那些会在这些 helpers 启动前读取环境变量的其他 entrypoint，再自行调用 Node 内置 `loadEnvFile()`。
3. 当你只需要分阶段的 `faas.yaml` 数据时，使用 `loadConfig()`。
4. 当你需要在自定义工具中处理 FaasJS 原始 YAML 子集、且不需要 staged discovery 时，使用 `parseYaml()`。
5. 当你需要最终可运行的导出 handler 时使用 `loadApiHandler()`；如果你已经有了 `Func` 实例，则使用 `loadPlugins()`。
6. 当直接在 Node 中执行并且需要理解本地 TypeScript 文件或 tsconfig aliases 时，优先使用 FaasJS TypeScript loader，并保持本地导入不带 `.ts` 或 `.tsx` 后缀。
7. 当你要从用户输入或 URL 推导出 root-scoped 文件路径时，先用 `isPathInsideRoot()` 做校验。
8. 自定义 Node 侧边界需要与 FaasJS API 和 jobs 一致的可选 Zod schema 解析与错误格式时，使用 `parseSchemaValue()`。
9. 复用 `Logger` 和共享 transport，而不是自己再包一套日志封装。

## 规则

### 1. 让 `node-utils` 只存在于 Node-only 代码路径中

- 这个 package 依赖 `node:module`、`node:process` 和文件系统等 Node API。
- 不要把它导入浏览器代码、React 组件，或必须运行在 edge runtime 的代码中。
- 可移植 helpers 请使用 `@faasjs/utils`，框架 / runtime primitives 请使用 `@faasjs/core` 或 `@faasjs/dev`。

### 2. 在 entrypoint 需要时尽早加载 `.env` 文件

- `@faasjs/core` 的 `Server` 和 `@faasjs/dev` 的 `viteFaasJsServer()` 在从 FaasJS 应用根目录启动时，已经会在 handlers 运行前尝试加载项目 `.env`。
- 对于 `faas run` 入口文件、本地脚本、测试、CLI，以及那些会在这些 helpers 启动前读取 `process.env` 的配置文件，仍然直接使用 `node:process` 里的 `loadEnvFile()`。
- 在读取 `process.env`、构造配置对象，或加载依赖环境变量的模块之前调用它。
- 如果 `server.ts` 会在 `new Server(...)` 之前做 bootstrap，或者同一个入口文件会通过 `faas run` 执行，那么保留显式的 `loadEnvFile()` 依然是一个稳妥默认值。
- 当 `.env` 是可选项且启动不该被中断时，用 `try/catch` 包起来。

```ts
import { loadEnvFile } from 'node:process'

try {
  loadEnvFile()
} catch (error) {
  console.warn('Failed to load env file', error)
}
```

### 3. 让 `loadConfig()` 负责解析 staged `faas.yaml`

- 不要自己重写目录遍历或手动 deep merge `faas.yaml`。
- `loadConfig()` 会从项目根目录一路走到函数目录，合并嵌套文件，应用 `defaults`，并为 plugin 条目标注解析后的 `name`。
- 这样能保证运行时行为与 FaasJS 的 plugin 加载逻辑一致。

```ts
import { loadConfig } from '@faasjs/node-utils'

const config = loadConfig(process.cwd(), '/project/src/orders/create.api.ts', 'production')

console.log(config.plugins?.http)
```

### 4. 为任务选择最小可用 loader

- 当脚本直接接收 YAML 文本，并且你希望得到与 FaasJS 配置解析相同的受支持子集与错误信息时，使用 `parseYaml()`。
- `parseYaml()` 不会遍历目录、应用 staging fallback，也不会校验 `faas.yaml` schema；当你没有走 `loadConfig()` 时，需要自行校验解析结果的结构。
- 需要最终 handler 时，使用 `loadApiHandler()`。
- 当你已经有 `Func` 实例，并希望在导出或挂载前附加 YAML 驱动的 plugins 与 config 时，使用 `loadPlugins()`。
- 一般性的 Node 动态模块加载，尤其目标是本地 TypeScript 文件或支持 path alias 的模块时，使用 `loadPackage()`。
- 优先使用这些 helpers，而不是临时写 `import()` 包装，这样 cache busting、tsconfig 解析和 plugin 装载行为才能保持一致。

```ts
import { loadEnvFile } from 'node:process'
import { loadApiHandler, parseYaml } from '@faasjs/node-utils'

loadEnvFile()

const pluginDefaults = parseYaml(`defaults:
  plugins:
    http:
      type: http
      config:
        cookie:
          session:
            secret: 'replace-me'
`)

const handler = await loadApiHandler(
  process.cwd(),
  '/project/src/orders/create.api.ts',
  process.env.NODE_ENV || 'development',
)

console.log(pluginDefaults)
const result = await handler(event, context)
```

### 5. 只在进程引导阶段注册 module hooks

- `registerNodeModuleHooks()` 适用于 CLI、dev server 或 bootstrap script 这种长生命周期的 Node entrypoint，尤其当它们需要 tsconfig path alias 解析时。
- 直接在 Node 中执行时，优先使用 preload 入口 `node --import @faasjs/node-utils/register-hooks <entry>`，这样脚本仍可保持标准的无扩展名本地导入。
- 它应在启动时调用一次。重复调用虽然安全，但分散在多个模块里会让启动意图更难理解。
- 在依赖全新 loader 状态的隔离测试里，请在 case 之间调用 `resetRuntime()`，而不是反复重建整个进程。

```ts
import { registerNodeModuleHooks } from '@faasjs/node-utils'

registerNodeModuleHooks({
  root: process.cwd(),
})

await import('./scripts/sync-users')
```

### 6. Node 侧日志保持在共享原语之上

- 使用 `Logger` 获得结构化级别、labels、timers 和环境变量驱动的日志详细度。
- 只有当日志必须被缓冲并转发到其他 sink 时，才使用 `getTransport()`。
- `colorfy()` 和 `formatLogger()` 是更底层的 helpers；除非你在实现日志基础设施，否则优先使用 `Logger`。

### 7. 为自定义 Node 边界使用 schema helpers

- `defineApi` 和 `defineJob` 已经会解析自己的 schema，所以应用 handler 应该使用注入的 `params`。
- 当 CLI、worker adapter、loader 或其他 Node-only 边界需要同样的可选 schema 行为时，使用 `parseSchemaValue()`；省略 schema 或输入为 nullish 时默认使用 `{}`，除非显式传入 `defaultValue`。
- 当公共 helper 类型需要跟随 Zod schema 的 output 类型，并在省略 schema 时回退到指定类型时，使用 `SchemaOutput<TSchema, TFallback>`。
- 只有在需要格式化校验信息但不希望抛错时，才直接使用 `formatSchemaError()`。

```ts
import { parseSchemaValue } from '@faasjs/node-utils'
import * as z from 'zod'

const params = await parseSchemaValue({
  schema: z.object({
    count: z.coerce.number().int().positive(),
  }),
  value: input,
  errorMessage: 'Invalid params',
})
```

### 8. 用 `isPathInsideRoot()` 校验 root-scoped 文件路径

- 在打开由 request URL、CLI 参数、配置值或其他用户可控片段拼出来的文件前，先调用 `isPathInsideRoot()`。
- 它会先规范化两边路径，对已存在路径使用 `realpath` 跟随 symlink，并且在目标文件尚不存在时，也会通过最近的已存在父目录完成规范化。
- 这让它很适合用于 static file serving、route lookup、template resolution，或任何必须拒绝 `../` traversal 和 symlink escape 的场景。
- 先把候选路径 `resolve()` 成绝对路径，再拿这个结果和预期 root 做校验。

```ts
import { isPathInsideRoot } from '@faasjs/node-utils'
import { resolve } from 'node:path'

const root = resolve(process.cwd(), 'public')
const candidate = resolve(root, requestPath)

if (!isPathInsideRoot(candidate, root)) {
  throw Error('Path escapes the static root')
}
```

## 评审清单

- `@faasjs/node-utils` 的导入只出现在 Node-only 代码中
- `faas run` 入口文件和本地脚本会在依赖环境变量的 bootstrap 逻辑前先加载 `.env`，除非 bootstrap 本身完全由 `Server` 或 `viteFaasJsServer()` 接管
- staged `faas.yaml` 通过 `loadConfig()` 或 `loadApiHandler()` 读取，而不是自定义 merge 逻辑
- 原始 FaasJS YAML 使用 `parseYaml()` 解析，而不是另一个 YAML parser
- 加载逻辑使用 `loadApiHandler()`、`loadPlugins()` 或 `loadPackage()`，而不是自定义动态 import 包装
- module hooks 在进程启动阶段注册，而不是深埋在 feature 代码中
- 自定义 Node 侧边界校验使用 `parseSchemaValue()`，而不是临时格式化 Zod 错误
- root-scoped 文件访问会用 `isPathInsideRoot()` 校验已解析路径
- 依赖全新 loader 状态的测试使用了 `resetRuntime()`
- 日志使用 `Logger` 或共享 transport，而不是直接包裹 `console`

## 延伸阅读

- [Logger 指南](./logger.md)
- [@faasjs/node-utils package reference](/doc/node-utils/)
- [isPathInsideRoot](/doc/node-utils/functions/isPathInsideRoot.html)
- [loadConfig](/doc/node-utils/functions/loadConfig.html)
- [loadApiHandler](/doc/node-utils/functions/loadApiHandler.html)
- [loadPackage](/doc/node-utils/functions/loadPackage.html)
- [loadPlugins](/doc/node-utils/functions/loadPlugins.html)
- [parseSchemaValue](/doc/node-utils/functions/parseSchemaValue.html)
- [parseYaml](/doc/node-utils/functions/parseYaml.html)
- [registerNodeModuleHooks](/doc/node-utils/functions/registerNodeModuleHooks.html)
