# faas.yaml 配置规范

英文: [faas.yaml Configuration Specification](./faas-yaml.md)

## 元信息

- 状态: 已采纳（Accepted）
- 版本: v1.0
- 维护者: FaasJS Maintainers
- 适用范围: `@faasjs/node-utils`、`@faasjs/dev`、`@faasjs/core`、`create-faas-app` 及基于 FaasJS 的 API 项目
- 最后更新: 2026-03-25

## 背景

`faas.yaml` 是 FaasJS 运行时配置入口，影响配置加载、本地开发服务解析与类型生成。

本规范用于定义与当前实现一致的仓库内基线。

相关参考：

- `packages/node-utils/src/load_config.ts`
- `packages/node-utils/src/parse_yaml.ts`
- `packages/dev/src/server_config.ts`
- `packages/dev/src/typegen.ts`

## 目标

- 保持配置发现与合并顺序可预测。
- 保持环境节点校验规则稳定。
- 明确支持的 YAML 子集。

## 规范条款

### 1. 文件命名与放置

1. 配置文件名必须为 `faas.yaml`。
2. 项目级配置应该放在 `<projectRoot>/src/faas.yaml`。
3. 可以在 `src/` 下的子目录放置额外 `faas.yaml` 用于局部覆盖。

### 2. 发现与合并顺序

1. 对于 `<srcRoot>/<path>/<file>.func.ts`，加载器必须按“由浅到深”发现配置文件：
   - `<srcRoot>/faas.yaml`
   - `<srcRoot>/<path-segment-1>/faas.yaml`
   - ...
   - `<srcRoot>/<path>/faas.yaml`
2. 生效配置必须按发现顺序合并，且更深目录覆盖更浅目录。
3. 对每个环境键 `S != defaults`，在完成文件级合并后，生效环境配置必须为 `deepMerge(defaults, S)`。
4. 当请求环境不存在时，运行时必须回退到 `defaults`，若 `defaults` 也不存在则回退到空对象。

### 3. 根对象与环境节点

1. 解析后的根值在存在时必须是对象。
2. 顶层环境节点在存在时必须是对象。
3. `defaults` 应该存在，并用于共享基线配置。

### 4. `server` 节点约定

1. `<staging>.server` 在存在时必须是对象。
2. `<staging>.server.root` 在存在时必须是字符串。
3. `<staging>.server.base` 在存在时必须是字符串。
4. 在 `@faasjs/dev` 中，`server.root` 必须相对项目根目录解析，且语义上表示项目根目录。
5. 在 `@faasjs/dev` 中，函数源码目录必须是 `<server.root>/src`。
6. 在类型生成中，输出路径必须是 `<server.root>/src/.faasjs/types.d.ts`。

### 5. `plugins` 节点写法

1. `<staging>.plugins` 可以省略。
2. 推荐写法是“插件键名 -> 插件配置对象”的映射。
3. 同一环境中的插件键名应该保持稳定，因为 `loadConfig()` 会基于该键名派生运行时 `name`。
4. `name` 是加载器生成的运行时字段，不应该手写在 `faas.yaml` 中。
5. 插件配置对象可以包含 `type`、`config` 以及其他插件私有字段。
6. 插件私有字段的内部结构不属于本规范范围，并且会在合并过程中保留。

### 6. 支持的 YAML 子集

1. 解析器必须支持基于缩进的映射与序列。
2. 解析器必须支持普通、单引号、双引号标量。
3. 解析器必须支持 `null`、`boolean`、`number`、`string` 标量类型。
4. 解析器必须支持锚点（`&`）、别名（`*`）和映射合并键（`<<`）。
5. 解析器禁止使用 Tab 作为缩进。
6. 解析器禁止使用多文档语法（`---`、`...`）。
7. 解析器禁止使用块标量（`|`、`>`）、YAML 标签（`!`）和非空 flow collection（`[a]`、`{a: 1}`）。
8. 可以使用空 flow collection：`[]` 与 `{}`。

### 7. 错误处理

1. 配置结构不合法时，必须抛出以下前缀的错误：
   - `[loadConfig] Invalid faas.yaml <filePath> at "<keyPath>": <reason>`
2. YAML 语法或功能不受支持时，必须抛出以下前缀的解析错误：
   - `[parseYaml]`
3. 配置消费方（如 dev server 启动、typegen）在加载失败时应该快速失败。

## 示例

```yaml
defaults:
  server:
    root: .
    base: /api
  plugins:
    http:
      type: http
      config:
        cookie:
          secure: false
```
