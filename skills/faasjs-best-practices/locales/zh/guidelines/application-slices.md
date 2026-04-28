# 应用切片指南

当你为 FaasJS 应用添加业务功能，或让 AI coding agent 构建功能时，请使用本指南。

FaasJS 应用切片是一个小而完整的垂直功能，它让 UI、API、校验、数据库变更、类型和测试能被一起发现和评审。切片通过稳定约定让人类和 Agent 直接编写代码，从而替代 generator-heavy 工作流。

## 一个切片包含什么

数据库驱动的 React 业务切片通常包括：

- `src/pages/**` 下的页面或 feature-local 组件
- 靠近页面或功能的一个或多个 `.api.ts` 文件
- 用于边界校验的内联 `defineApi` schema
- 当数据结构变化时，放在 `migrations/**` 下的 PostgreSQL migration
- `src/types/**` 下的 `@faasjs/pg` 表声明
- 靠近 API 文件的 API 测试
- 当数据库行为重要时的 PG 断言
- 当 UI 请求流、加载、错误或用户交互重要时的 React 测试

保持切片足够小，让评审者不用跳转到无关框架层也能理解行为。

## 推荐布局

`create-faas-app` 生成的 `admin` starter 包含一个可复制的 users 切片。users 切片建议使用类似布局：

```text
migrations/20250101000000_create_users.ts
src/types/faasjs-pg.d.ts
src/pages/users/index.tsx
src/pages/users/api/list.api.ts
src/pages/users/api/create.api.ts
src/pages/users/api/__tests__/list.test.ts
src/pages/users/api/__tests__/create.test.ts
```

对于嵌套或 feature-local API，把 API 路径放在拥有它的页面附近：

```text
src/pages/settings/users/index.tsx
src/pages/settings/users/api/list.api.ts
src/pages/settings/users/api/update-role.api.ts
src/pages/settings/users/api/__tests__/update-role.test.ts
```

切片内部优先使用短相对导入，除非项目已经配置了对应 TypeScript alias。

不要把测试集中放到 package 级别的 `src/__tests__` 兜底目录，也不要在这个集中目录下再按 feature 建子目录。应该让 feature 文件夹自己拥有 `__tests__`。每个 feature、slice、API 文件夹、job 文件夹、helper 文件夹或组件文件夹都应该拥有自己的 `__tests__`，让测试始终贴着它保护的行为。

当一个业务单元原本只是单文件时，把这个文件改成目录模块，并把测试放进这个目录下的 `__tests__`：

```text
# 避免
src/useBilling.ts
src/__tests__/useBilling.test.ts
src/__tests__/useBilling/useBilling.test.ts

# 推荐
src/useBilling/index.ts
src/useBilling/__tests__/useBilling.test.ts
```

## API 与校验

每个 API 入口都应使用 `defineApi`。

除非 schema 被多个 API 复用或形成真实边界，否则将 schema 放在 handler 附近。优先使用明确 params、显式 returning columns 和收窄 response 结构，让 UI 代码和测试保持类型可感知。

避免用泛化 helper 隐藏校验、数据库访问或 response 契约。当重复能让切片更容易被 Agent 和评审者理解时，少量重复是可以接受的。

## 数据库变更

当切片改变数据结构时：

- 在 `migrations/**` 下添加时间戳 migration
- 更新 `src/types/**` 下的 `@faasjs/pg` 表声明
- 保持表 row 类型具体
- 用 `@faasjs/pg-dev` 测试重要数据库行为

不要对业务表依赖宽泛的 `Record<string, any>` row 结构。

## UI 变更

业务 UI 使用 React 和 FaasJS Ant Design 路径。

当场景适合时，优先使用 `@faasjs/ant-design` wrapper，例如 `Form`、`Table`、`Description`、`Title`、`Tabs`、`Loading` 和 `ErrorBoundary`。只有当 wrapper 不适合或自定义 UI 更清晰时，才降级到原始 Ant Design 组件。

保持页面级状态和请求流可读。只有当组件、hook 或 helper 被复用、形成真实边界，或能简化大块代码时再抽取。

## 测试

API 测试应放在对应 API 文件夹的 `__tests__` 下。

非 API 测试也遵循同样的 feature-local 布局原则：React、job、helper 或集成测试应放在对应页面、job、工具或 slice 文件夹自己的 `__tests__` 下，而不是统一集中到脱离业务代码的 package 级测试目录。

测试定义切片行为的内容：

- 合法输入和期望输出
- 校验失败和重要错误路径
- 相关数据库写入、读取、排序和计数
- plugin 影响 API 时的权限或当前用户行为
- 页面包含有意义交互时的 UI 请求流

除非测试明确是 unit-scoped，否则避免用宽泛 mock 绕过 FaasJS plugin、校验或数据库行为。

## Agent 工作流

让 AI coding agent 添加或修改功能时，描述切片，而不是要求 generator 命令。

推荐 prompt 形态：

```text
Add a users slice with a list page, create API, PostgreSQL migration, table types, and API tests. Follow the FaasJS curated stack and keep files near src/pages/users.
```

Agent 应该：

- 先检查附近切片和指南
- 创建或更新垂直行为所需的全部文件
- 将业务特定关注点保留在应用代码或 plugin 中
- 运行最小有意义测试
- 避免无关重构

## 为什么不是 Rails-style generators

Rails generators 帮助人类创建重复结构。FaasJS 假设当约定、示例、schema 和测试足够清晰时，AI coding agent 可以直接编写这些结构。

在添加 generator 命令之前，优先投入更好的切片、示例和文档。只有当 generator 明确改善精选主路径，且无法被更好的约定或示例替代时，才考虑添加。
