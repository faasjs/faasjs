# Plugin 规范

## 背景

FaasJS 在两个互补层次上支持 plugins：

- 代码直接把 plugin 实例注册到 `Func`
- `faas.yaml` 提供分阶段、按目录感知的 plugin 配置

运行时行为在 `@faasjs/core` 与 `@faasjs/node-utils` 中已经比较稳定，但契约目前仍分散在源码、测试和旧文档中。

这份规范定义了 plugin 标识、生命周期执行、配置分层以及配置驱动加载的基线。

相关参考：

- `packages/core/src/func/index.ts`
- `packages/core/src/index.ts`
- `packages/node-utils/src/load_config.ts`
- `packages/core/src/plugins/http/index.ts`
- `docs/zh/guide/excel/plugin.md`

## 目标

- 保持 plugin 编写与加载行为可预测。
- 定义 plugin 标识、顺序、配置优先级与去重规则。
- 让代码注册与 `faas.yaml` 配置协同工作，而不会出现归属不清。
- 让配置驱动加载与当前 `defineApi()` 行为保持一致。

## 非目标

- 定义每个 plugin package 私有的 `config` schema。
- 标准化 npm 发布、版本管理或 marketplace metadata。

## 规范性规则

### 1. 运行时 Plugin 契约

1. 一个 plugin 实例必须暴露字符串类型的 `type` 和 `name` 字段。
2. Plugin `name` 必须标识运行时 plugin id。
3. Plugin `type` 必须标识 plugin 来源、家族或 module specifier，而不是运行时实例 id。
4. Plugin `name` 在同一个函数中应保持稳定，因为顺序、去重、日志和配置查找都依赖它。
5. Plugin 可以实现 `onMount`、`onInvoke`，也可以两个都实现。
6. 被 `defineApi()` 自动加载的 plugins，必须来自一个构造器，其 prototype 至少实现一个生命周期方法：`onMount` 或 `onInvoke`。
7. 代码中注册的 plugins 可以实现 `applyConfig(resolvedConfig)`，以便在第一次 mount 之前接收该 plugin id 的最终合并配置。

### 2. 生命周期执行模型

1. 用户 plugins 必须在内建 run-handler plugin 之前执行。
2. `onMount` hooks 必须按 plugin 顺序执行，并且每个 `Func` 实例至多执行一次。
3. `onInvoke` hooks 必须按 plugin 顺序在每次调用时执行。
4. Plugin 必须通过 `await next()` 继续生命周期链。
5. 同一个生命周期 hook 内多次调用 `next()` 时，必须 reject 并报 `next() called multiple times`。
6. Plugins 可以修改 mount 或 invoke data，以注入字段、准备上下文或控制最终响应。
7. Plugin 或下游 handler 抛出的错误必须中止当前链路，并向调用方传播。

### 3. 配置分层与优先级

1. Plugin 配置可以写在代码中、`faas.yaml` 中，或者两者同时存在。
2. `faas.yaml` 中的 plugin 配置必须支持从项目根目录到目标函数目录的目录级分层。
3. 当多个 `faas.yaml` 文件为同一个 plugin id 提供配置时，更深目录的配置必须覆盖更浅目录的配置，同时通过 deep merge 保留未指定字段。
4. 同一个 plugin id 上，代码里写的 plugin 配置必须覆盖从 `faas.yaml` 合并出来的配置。
5. Plugin 配置合并必须以 plugin `name` 作为身份 key。
6. 暴露在 `func.config.plugins` 上的最终 plugin 配置，必须反映目录分层与代码覆盖后的最终视图。

### 4. 手动注册

1. `new Func({ plugins: [...] })` 必须保持传入 plugin 数组的顺序。
2. 手动传入的 plugin 数组不得隐式去重；是否避免重复 plugin names，由调用方自己负责。
3. 当代码已经注册了 plugin 实例时，该实例仍然是运行时行为的来源；配置解析可以补充其设置，但不能静默地用 YAML 中的另一个实例替换它。
4. 如果一个已注册 plugin 实例实现了 `applyConfig`，loader 应把该 plugin id 的最终合并配置传给它。

### 5. `defineApi()` 中的配置驱动加载

1. `defineApi()` 必须在第一次 mount 或 invoke 前解析 staged `faas.yaml` 配置和 `func.config.plugins`。
2. Loader 只能检查 `config.plugins` 上自有且可枚举的 keys。
3. `func.config.plugins` 中的 plugin 配置条目必须以 plugin id 作为 key。
4. 对配置驱动加载来说，解析后的 plugin `name` 必须默认等于条目 key，因此它天然代表 plugin id。
5. 对对象形态的配置条目，解析后的 plugin `type` 必须优先来自 `type`；只有在运行时显式支持的内建 alias 场景下，才允许回退到条目 key。
6. Loader 必须用“解析后的配置对象 + 解析后的 `name` 与 `type`”来实例化 plugin。
7. 如果函数上已经存在同名 `name` 的 plugin，配置驱动加载不得创建重复的运行时实例。
8. 当代码中已经存在 plugin 实例，且同一个 id 在配置中也存在时，最终解析后的配置仍必须挂到 `func.config.plugins[name]` 上，并以代码中的值优先。

### 6. 模块与构造器解析

1. Plugin type `http` 与 alias `@faasjs/http` 必须解析到模块 `@faasjs/core`。
2. 不带 scope 的裸 plugin types（如 `mysql`）必须解析到 `@faasjs/<type>`。
3. Scoped package names、相对路径、绝对路径和 `file://` 本地文件 URL，在去掉可选的 `npm:` 前缀后，必须按原样解析。
4. 从模块中解析 class export 时，loader 必须优先尝试由 plugin type 或末尾路径片段规范化得到的 PascalCase 类名。
5. 如果找不到对应的具名 class export，loader 必须回退到模块默认导出。
6. 如果具名导出与默认导出都不是有效的生命周期 plugin constructor，loader 必须抛错。
7. 如果构造函数执行时报错，或返回的不是对象形态 plugin 实例，loader 必须抛错。

### 7. `defineApi()` 要求

1. 一个 `defineApi()` 函数在完成 plugin 解析后必须拥有 `http` plugin。
2. 如果缺少 `http` plugin，调用时必须失败，并抛出能明确指出缺少 `http` plugin 的错误。
3. 额外 plugins 可以在业务 handler 执行前修改 invoke data，以向 handler 注入字段。
4. 向 handler 注入额外字段的 plugin packages，应提供对 `DefineApiInject` 的 TypeScript module augmentation。

## 示例

### 手写生命周期 plugin

```ts
import { Func, type InvokeData, type Next, type Plugin } from '@faasjs/core'

class TracePlugin implements Plugin {
  public readonly name = 'trace'
  public readonly type = '@/plugins/trace'

  public async onInvoke(data: InvokeData, next: Next) {
    data.context.trace = ['before']
    await next()
    data.context.trace.push('after')
  }
}

export const func = new Func({
  plugins: [new TracePlugin()],
  async handler({ context }) {
    context.trace.push('handler')
    return context.trace
  },
})
```

### 配置分层与代码优先级

```yaml
# src/faas.yaml
defaults:
  plugins:
    auth:
      type: file://./plugins/auth-plugin.ts
      config:
        provider: jwt
        secret: from-root
```

```yaml
# src/admin/faas.yaml
defaults:
  plugins:
    auth:
      config:
        secret: from-admin
```

```ts
import { defineApi } from '@faasjs/core'

export const func = defineApi({
  async handler({ config, current_user }) {
    return {
      current_user,
      auth: config.plugins?.auth,
    }
  },
})

func.config = {
  plugins: {
    auth: {
      config: {
        secret: 'from-code',
      },
    },
    http: {
      config: {},
    },
  },
}
```

在最终解析后的配置中：

- plugin id 是 `auth`，因此运行时 `name === 'auth'`
- plugin source 来自配置中的 `type`
- `secret` 最终解析为 `'from-code'`
- `provider` 仍然保留为 `'jwt'`
