# faas.yaml 配置规范

## 背景

`faas.yaml` 是 FaasJS 在配置加载、本地开发服务解析和类型生成中使用的运行时配置入口。

这份规范定义了与当前 FaasJS 运行时行为一致的公开基线。

相关参考：

- `packages/node-utils/src/load_config.ts`
- `packages/node-utils/src/parse_yaml.ts`
- `packages/dev/src/server_config.ts`
- `packages/dev/src/typegen.ts`
- `@faasjs/node-utils` 的 `parseYaml()`

## 目标

- 保持配置发现顺序与合并顺序可预测。
- 保持 staging 级别的校验行为可预测。
- 明确定义支持的 YAML 子集。
- 为自定义 Node.js 工具提供一个支持相同 YAML 子集的 parser 入口。

## 规范性规则

### 1. 文件命名与放置位置

1. 配置文件名必须是 `faas.yaml`。
2. 项目级配置应放在 `<projectRoot>/src/faas.yaml`。
3. 可以在 `src/` 下的嵌套目录中放置额外的 `faas.yaml`，用于局部覆盖。

### 2. 发现与合并顺序

1. 对于位于 `<srcRoot>/<path>/<file>.func.ts` 的函数文件，loader 必须按从浅到深的顺序发现配置文件：
   - `<srcRoot>/faas.yaml`
   - `<srcRoot>/<path-segment-1>/faas.yaml`
   - ...
   - `<srcRoot>/<path>/faas.yaml`
2. 有效配置必须按发现顺序进行合并，越深层的配置覆盖越浅层的配置。
3. 对于每个 `S != defaults` 的 staging key，在文件级合并完成后，有效 staging 配置必须为 `deepMerge(defaults, S)`。
4. 如果请求的 staging 不存在，运行时必须依次 fallback 到 `defaults`，再 fallback 到空对象。

### 3. 根对象与 staging keys

1. 解析后的根值在提供时必须是对象。
2. 每个顶层 staging 值在提供时必须是对象。
3. `defaults` 应存在，并应包含共享的基线设置。

### 4. `server` 节点约定

1. `<staging>.server` 在存在时必须是对象。
2. `<staging>.server.root` 在存在时必须是字符串。
3. `<staging>.server.base` 在存在时必须是字符串。
4. 在 `@faasjs/dev` 中，`server.root` 必须相对于项目根目录解析，并表示项目根目录。
5. 在 `@faasjs/dev` 中，源码根目录必须是 `<server.root>/src`。
6. 在类型生成中，输出路径必须是 `<server.root>/src/.faasjs/types.d.ts`。

### 5. `plugins` 节点编写方式

1. `<staging>.plugins` 可以省略。
2. 推荐的写法是：从 plugin key 到 plugin config object 的映射。
3. 同一个 staging 内的 plugin key 应保持稳定，因为 `loadConfig()` 会从该 key 推导运行时的 `name`。
4. `name` 是 loader 在运行时生成的字段，不应手写在 `faas.yaml` 中。
5. 一个 plugin config object 可以包含 `type`、`config` 以及其他 plugin 自定义字段。
6. Plugin `type` 可以写成内建 alias、裸 package type、scoped package name、相对路径、绝对路径，或 `file://` 本地文件 URL。
7. plugin 自身的内部字段不在本规范范围内，合并时应原样保留。

### 6. 支持的 YAML 子集

1. parser 必须支持基于缩进的 mappings 与 sequences。
2. parser 必须支持 plain、single-quoted 与 double-quoted scalars。
3. parser 必须支持这些 scalar 值：`null`、`boolean`、`number` 和 `string`。
4. parser 必须支持 mappings 中的 anchors（`&`）、aliases（`*`）和 merge key（`<<`）。
5. parser 不允许使用 tab 作为缩进。
6. parser 不允许多 YAML 文档（`---`、`...`）。
7. parser 不允许 block scalars（`|`、`>`）、YAML tags（`!`）或非空 flow collections（`[a]`、`{a: 1}`）。
8. 空 flow collections `[]` 与 `{}` 可以使用。

### 7. 错误处理

1. 非法配置结构必须抛出以如下前缀开头的错误：
   - `[loadConfig] Invalid faas.yaml <filePath> at "<keyPath>": <reason>`
2. 不支持的 YAML 语法 / 特性必须抛出以前缀开头的解析错误：
   - `[parseYaml]`
3. 配置消费者（例如 dev server 启动或 typegen）在配置加载失败时应快速失败。

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
