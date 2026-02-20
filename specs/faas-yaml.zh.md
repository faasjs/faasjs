# faas.yaml 配置规范

英文: [faas.yaml Configuration Specification](./faas-yaml.md)

## 元信息

- 状态: 已采纳（Accepted）
- 版本: v1.0
- 维护者: FaasJS Maintainers
- 适用范围: `@faasjs/node-utils`、`@faasjs/dev`、`@faasjs/core`、`create-faas-app` 及基于 FaasJS 的 API 项目
- 最后更新: 2026-02-20

## 背景

`faas.yaml` 是 FaasJS 运行时配置入口，影响配置加载、本地开发服务解析与类型生成。历史文档覆盖了部分规则，但关键行为由源码实现。

本规范用于定义与当前实现一致的仓库内基线。

相关参考：

- `packages/node-utils/src/load_config.ts`
- `packages/node-utils/src/parse_yaml.ts`
- `packages/dev/src/server_config.ts`
- `packages/dev/src/typegen.ts`

历史参考（本阶段保持不变）：

- `docs/guide/README.md`
- `docs/zh/guide/excel/faas-yaml.md`

## 目标

- 保持配置发现与合并顺序可预测。
- 保持环境节点校验规则稳定。
- 明确支持的 YAML 子集。

## 非目标

- 不定义 `plugins.<name>.config` 的插件业务字段。
- 不定义 provider/deploy 的内部字段结构。
- 不将当前解析器替换为完整 YAML 1.2 实现。

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
2. 顶层环境节点在存在时必须是对象或 `null`。
3. `defaults` 应该存在，并用于共享基线配置。
4. 顶层 `types` 键禁止使用。
5. `<staging>.types` 键禁止使用。

### 4. `server` 节点约定

1. `<staging>.server` 在存在时必须是对象。
2. `<staging>.server.root` 在存在时必须是字符串。
3. `<staging>.server.base` 在存在时必须是字符串。
4. 在 `@faasjs/dev` 中，`server.root` 必须相对项目根目录解析，且语义上表示项目根目录。
5. 在 `@faasjs/dev` 中，函数源码目录必须是 `<server.root>/src`。
6. 在类型生成中，输出路径必须是 `<server.root>/src/.faasjs/types.d.ts`。

### 5. `plugins` 节点约定

1. `<staging>.plugins` 在存在时必须是对象。
2. `faas.yaml` 中每个插件条目的值必须是对象。
3. 加载器必须为每个插件条目注入 `name` 字段，值为插件键名。
4. 加载器未显式校验的字段可以存在，且必须在合并后保留。

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
    knex:
      type: knex
      config: &knex_config
        client: pg
        migrations:
          directory: ./src/db/migrations
          extension: ts

development:
  plugins:
    knex:
      config:
        <<: *knex_config
        client: pglite
        connection: ./.pglite_dev

testing:
  plugins:
    knex:
      config:
        <<: *knex_config
        client: pglite
```

## 兼容性

- 现有项目即使没有 `defaults` 仍可运行，但推荐使用 `defaults`。
- 校验规则之外的自定义键目前会被加载器透传。
- `faas.yaml` 中的 `types` 键已移除，属于无效配置。
- 历史教程文档继续保留，但在当前内部 spec 阶段不作为规范性来源。

## 迁移检查清单

- [ ] 确保配置文件统一为 `faas.yaml`（不是 `faas.yml`）。
- [ ] 将共享配置收敛到 `defaults`。
- [ ] 移除顶层 `types` 与 `<staging>.types`。
- [ ] 确保 `server.root` 与 `server.base` 在存在时为字符串。
- [ ] 确保每个 `plugins.<name>` 条目值为对象。
