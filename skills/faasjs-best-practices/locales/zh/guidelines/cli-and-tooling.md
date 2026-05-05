# CLI and Tooling 指南

当你在运行 CLI 命令、排查命令错误或为任务选择合适的工具时，请使用这份指南。它是 FaasJS 工具链的快速参考，帮助减少命令执行错误。

## 默认工作流

1. 在运行任何 FaasJS 命令之前，先执行 `npm install` 安装依赖。
2. 在创建、重命名或移动 `.api.ts` 文件后，运行 `faas types` 重新生成类型声明。
3. 在提交前使用 `vp check --fix` 进行代码格式化和 lint 检查。
4. 使用 `vp test` 作为默认测试运行器；可使用 `vp test <pattern>` 进行针对性运行。
5. 当有迁移待执行时，通过 `faasjs-pg migrate` 运行数据库迁移。
6. 当命令不可用时，回退到 `npx <command>`，并确认 `node_modules` 目录存在。

## faas CLI

由 `@faasjs/dev` 提供 `faas` 二进制命令 (`faas.mjs`)。它有两个子命令：`run` 和 `types`。

| 命令                            | 说明                                                     |
| ------------------------------- | -------------------------------------------------------- |
| `faas run <file>`               | 使用预加载的 FaasJS Node 模块 hooks 运行 TypeScript 文件 |
| `faas run <file> --root <path>` | 指定项目根目录来解析 `<file>`（默认：`process.cwd()`）   |
| `faas types`                    | 生成 API 类型声明到 `src/.faasjs/types.d.ts`             |
| `faas types --root <path>`      | 指定类型生成的项目根目录                                 |

全局选项：

- `-h, --help` — 显示帮助文本。
- `-v, --version` — 打印 `@faasjs/dev` 版本。

> **运行细节**：`faas run` 解析 `@faasjs/node-utils/register-hooks` 并使用 `--import` 启动一个子 Node 进程，使目标脚本获得正常的 `process.argv`。

> **类型生成细节**：`faas types` 扫描 `src/` 目录下的 `.api.ts` 文件，将文件名转换为路由，并写入 `src/.faasjs/types.d.ts`。它会跳过 `.faasjs` 和 `node_modules` 目录。只有 `.api.ts` 文件和 `faas.yaml` 的变化会触发类型重新生成（参见 `@faasjs/dev` 中的 `isTypegenInputFile`）。

## Vite Plus / vp

由 `vite-plus` 包提供。它是在 Vite 和 Vitest 之上构建的开发与构建工具层。

| 命令                | 说明                                                  |
| ------------------- | ----------------------------------------------------- |
| `vp check --fix`    | 通过 oxlint 和 oxfmt 运行代码检查（lint）和格式化修复 |
| `vp test`           | 使用 Vitest 运行所有测试                              |
| `vp test <pattern>` | 运行匹配文件名模式的测试                              |
| `vp test --watch`   | 以 watch 模式运行测试                                 |
| `vp dev`            | 启动开发服务器                                        |

常用组合：

```bash
# 在交付前运行检查和测试
vp check --fix && vp test

# 运行特定的测试文件
vp test src/pages/users/api/__tests__/list.test.ts

# 按模式匹配并 watch 运行测试
vp test list --watch

# 指定日志级别运行测试
FaasLog=info vp test

# 在自定义端口启动开发服务器（在 vite.config.ts 中配置）
vp dev
```

## 项目创建

使用 `create-faas-app` 来搭建新项目。

```bash
npx create-faas-app --name <project-name>
```

选项：

- `--name <name>` — 项目文件夹名称。
- `--template <template>` — 模板名称（默认：`admin`）。

可用模板：

- `admin`（默认）— 推荐的 React + Ant Design + PostgreSQL 起步模板。
- `minimal` — 更轻量的 React 起步模板。

搭建完成后，脚本会自动执行：

1. `npm install` — 安装依赖。
2. `npm run test` — 运行初始测试套件以验证配置。

创建后手动运行这些步骤：

```bash
cd <project-name>
npm install
npx faas types
```

## 迁移命令

由 `@faasjs/pg` 提供 `faasjs-pg` 二进制命令。

| 命令                   | 说明                                          |
| ---------------------- | --------------------------------------------- |
| `faasjs-pg new <name>` | 在 `migrations/` 中创建新的带时间戳的迁移文件 |
| `faasjs-pg status`     | 显示所有迁移的状态                            |
| `faasjs-pg migrate`    | 运行所有待执行的迁移                          |
| `faasjs-pg up`         | 运行下一个待执行的迁移                        |
| `faasjs-pg down`       | 回滚最近一次已应用的迁移                      |

要求：

- `status`、`migrate`、`up` 和 `down` 命令需要设置 `DATABASE_URL` 环境变量。
- 迁移文件默认存放在 `./migrations` 目录下。
- 迁移文件命名规范：`<timestamp>-<name>.ts`（由 `faasjs-pg new` 自动生成）。
- 迁移编写规则参见 [PG Schema and Migrations 指南](./pg-schema-and-migrations.md)。

示例：

```bash
DATABASE_URL=postgres://localhost:5432/myapp npx faasjs-pg migrate
DATABASE_URL=postgres://localhost:5432/myapp npx faasjs-pg new add_users_table
```

## 类型生成工作流

保持类型声明与 API 路由同步：

1. 在**创建**、**重命名**或**移动** `.api.ts` 文件后，运行：

   ```bash
   npx faas types
   ```

2. 生成的文件写入到 `src/.faasjs/types.d.ts`。

3. 输出结果通过模块扩展（module augmentation）在 `@faasjs/types` 上声明 `FaasActions` 接口，为每个路由提供类型化的 `InferFaasAction` 和 `InferFaasApi`。

4. `faas types` 是幂等的：它会将生成的内容与现有文件进行比较，仅在内容有变化时才会写入。

5. 如需在代码中生成类型（例如在脚本中），可以从 `@faasjs/dev` 导入 `generateFaasTypes`：

   ```ts
   import { generateFaasTypes } from '@faasjs/dev'

   const result = await generateFaasTypes({ root: process.cwd() })
   console.log(result.output, result.routeCount)
   ```

## 测试命令

| 命令                   | 说明                                                            |
| ---------------------- | --------------------------------------------------------------- |
| `vp test`              | 运行完整的测试套件                                              |
| `vp test <pattern>`    | 运行匹配文件名模式的测试（例如 `vp test list` 会运行 `*list*`） |
| `vp test --watch`      | 文件变更时重新运行测试                                          |
| `FaasLog=info vp test` | 以指定的日志详细级别运行测试                                    |

测试原则参见 [测试指南](./testing.md)，Vitest 项目配置参见 [项目配置指南](./project-config.md)。

## 常见命令错误及恢复

### `faas: command not found`

- **检查**：`npx faas --version` 或 `npx @faasjs/dev --version`
- **恢复**：确保已安装 `@faasjs/dev`：`npm install @faasjs/dev`
- **根本原因**：`faas` 二进制命令定义在 `@faasjs/dev` 中，不是全局命令。

### `vp: command not found`

- **检查**：`npx vp --version`
- **恢复**：确保已安装 `vite-plus`：`npm install vite-plus`
- **根本原因**：`vp` 二进制命令由 `vite-plus` 提供。

### `faas types` 失败

- **检查**：`src/faas.yaml` 是否存在？YAML 是否有效？
- **检查**：`src/` 目录下是否至少有一个 `.api.ts` 文件？
- **恢复**：如果在项目根目录之外，运行 `npx faas types --root .`。
- **参见**：[faas.yaml 规范](../locales/en/specs/faas-yaml.md)

### `faasjs-pg` 命令失败

- **检查**：是否设置了 `DATABASE_URL`？`echo $DATABASE_URL`
- **检查**：数据库是否可达？`psql $DATABASE_URL -c 'SELECT 1'`
- **恢复**：在命令前添加 `DATABASE_URL=postgres://...` 或在 `.env` 中设置。
- **根本原因**：除 `new` 之外的所有 `faasjs-pg` 命令都需要活动的数据库连接。

### 测试失败

- **检查**：依赖是否已安装？`npm ls @faasjs/dev vite-plus vitest`
- **检查**：项目是否有有效的 `vitest.config.ts` 或 `vite.config.ts`？
- **检查**：集成测试所需的环境变量（例如 `DATABASE_URL`）是否可用？
- **恢复**：先运行一个针对性测试：`vp test src/specific/test.ts`
- **参见**：Vite/Vitest 配置参见 [项目配置指南](./project-config.md)。

## 环境变量与配置

### FaasJS 运行时

| 变量               | 说明                                             | 默认值        |
| ------------------ | ------------------------------------------------ | ------------- |
| `FaasEnv`          | `faas.yaml` 配置加载所使用的活动环境名称         | `development` |
| `FaasLog`          | 最低日志级别（`debug`、`info`、`warn`、`error`） | `info`        |
| `FaasLogMode`      | 日志输出格式（`plain`、`pretty`）                | 自动检测      |
| `FaasLogSize`      | 非错误长日志的截断阈值（字节）                   | 平台相关      |
| `FaasLogTransport` | 启用或禁用共享日志传输转发                       | `true`        |

### 数据库

| 变量           | 说明                  | 使用者                                                              |
| -------------- | --------------------- | ------------------------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL 连接字符串 | `faasjs-pg` CLI、`@faasjs/pg` 客户端启动、`@faasjs/pg-dev` 测试插件 |

### 使用示例

```bash
# 使用 debug 日志运行测试
FaasLog=debug vp test

# 针对特定数据库运行迁移
DATABASE_URL=postgres://user:pass@localhost:5432/myapp npx faasjs-pg migrate

# 为特定项目根目录运行类型生成
npx faas types --root /path/to/project
```

## 关键配置文件

| 文件             | 用途                                                  |
| ---------------- | ----------------------------------------------------- |
| `faas.yaml`      | 运行时配置：server root、base path、环境覆盖、插件    |
| `tsconfig.json`  | TypeScript 配置，继承 `@faasjs/types/tsconfig/*` 预设 |
| `vite.config.ts` | Vite/Vitest 配置，使用 `@faasjs/dev` 的 `viteConfig`  |
| `.env`           | 本地开发的环境变量覆盖                                |

## 规则

1. **每次修改 `.api.ts` 后运行 `faas types`。** 创建、重命名或移动 API 文件后如果不重新生成类型，会导致调用方出现类型错误。
2. **优先使用 `vp check --fix` 而非手动格式化。** 它通过 vite-plus 共享配置使用 oxlint 和 oxfmt。
3. **优先使用 `vp test` 而非直接调用 `vitest`。** 它使用项目的 `vite.config.ts`，其中包含所有必要的插件和别名。
4. **当二进制命令未全局安装时，使用 `npx`。** `faas` 和 `vp` 都是项目 `node_modules` 的本地命令。
5. **运行 `faasjs-pg` 命令前先设置 `DATABASE_URL`。** 除 `new` 之外的所有操作都需要活动的数据库连接。
6. **保持迁移时间戳唯一。** `faasjs-pg new` 命令使用 ISO 时间戳；不要手动编辑文件名以避免顺序冲突。
7. **不要手动编辑 `src/.faasjs/types.d.ts`。** 它由 `faas types` 重新生成，任何手动修改都会被覆盖。
8. **使用 `FaasLog` 详细级别进行调试，而不是修改日志调用点。** 日志运行时会遵循 `FaasLog` 的设置。

## 评审清单

- `.api.ts` 变更后已运行 `faas types`（或有记录的原因说明）
- `faas.yaml` 是有效的 YAML，并遵循 [faas.yaml 规范](../locales/en/specs/faas-yaml.md)
- 提交前 `vp check --fix` 通过
- `vp test` 通过（或记录了阻塞原因 + 已运行的小范围验证）
- 运行 `faasjs-pg` 迁移命令前已设置 `DATABASE_URL`
- 迁移文件在 `migrations/` 目录下，并遵循时间戳命名规范
- `src/.faasjs/types.d.ts` 未经手动编辑
- 当二进制命令未全局安装时，使用了 `npx` 前缀
- 环境变量（`FaasEnv`、`FaasLog`、`DATABASE_URL`）按项目需要进行文档记录或已明确
