# 应用切片指南

在向 FaasJS 应用添加业务功能或要求 AI 编码代理构建功能时使用本指南。

FaasJS 应用切片是一个小型、完整的垂直功能，它将 UI、API、验证、数据库变更、类型和测试集中在一起，使其易于查找和审查。切片通过为人类和代理提供可直接遵循的稳定约定，取代了以生成器为中心的工作流。

## 切片包含的内容

一个数据库驱动的 React 业务切片通常包括：

- `src/pages/**` 下的页面或功能本地组件
- 靠近其支持的页面或功能的一个或多个 `.api.ts` 文件
- 用于边界验证的内联 `defineApi` schema
- 数据形状变更时在 `src/db/migrations/**` 下的 PostgreSQL 迁移
- `src/types/**` 下的 `@faasjs/pg` 表声明
- API 文件附近的 API 测试
- 数据库行为重要时的 PG 断言
- UI 请求流、加载、错误或用户交互重要时的 React 测试

保持切片足够小，以便审查者无需穿越不相关的框架层即可理解其行为。

## 推荐布局

`create-faas-app` 生成的 `admin` 启动模板包含一个可复制的 users 切片。对于 users 切片，推荐如下布局：

```text
src/db/migrations/20250101000000_create_users.ts
src/db/tables/users.ts
src/pages/users/index.tsx
src/pages/users/api/list.api.ts
src/pages/users/api/create.api.ts
src/pages/users/api/__tests__/list.test.ts
src/pages/users/api/__tests__/create.test.ts
```

对于嵌套的或功能本地的 API，将 API 路径保持在拥有它的页面附近：

```text
src/pages/settings/users/index.tsx
src/pages/settings/users/api/list.api.ts
src/pages/settings/users/api/update-role.api.ts
src/pages/settings/users/api/__tests__/update-role.test.ts
```

在切片内使用短相对导入，除非已配置现有的 TypeScript 别名。

不要将测试集中到包级别的 `src/__tests__` 文件夹中。这也包括 `src/__tests__/<feature>` 子文件夹：功能文件夹本身应拥有 `__tests__`。每个功能、切片、API 文件夹、任务文件夹、辅助文件夹或组件文件夹应拥有自己的 `__tests__` 文件夹，以便测试与它们所保护的行为保持关联。

当切片本来只是单个业务文件时，将该文件转换为文件夹模块，并将其测试放在该文件夹的 `__tests__` 下：

```text
# 避免
src/useBilling.ts
src/__tests__/useBilling.test.ts
src/__tests__/useBilling/useBilling.test.ts

# 推荐
src/useBilling/index.ts
src/useBilling/__tests__/useBilling.test.ts
```

## API、验证和安全

为每个 API 入口点使用 `defineApi`。

将 schema 保持在处理程序附近，除非它们在多个 API 之间复用或形成真正的边界。优先使用显式参数、显式返回列和狭窄的响应形状，以便 UI 代码和测试保持类型感知。

在读取或变更数据之前，检查切片是否需要当前用户、租户、组织、项目、角色或权限范围。将横切业务上下文放入项目插件中，然后对注入的字段进行类型化，使处理程序保持显式。

对预期的业务、认证、权限、资源缺失和冲突失败使用显式 HTTP 状态码。将意外的失败保留给真正的内部错误。

避免隐藏验证、授权、数据库访问或响应契约的通用辅助函数。一点重复是可以接受的，当它使切片更易于代理和审查者理解时。

## 数据库变更

当切片改变数据形状时：

- 在 `src/db/migrations/**` 下添加带时间戳的迁移
- 更新 `src/types/**` 下的 `@faasjs/pg` 表声明
- 保持表行类型具体
- 使用 `@faasjs/pg-dev` 测试重要的数据库行为

不要依赖宽泛的 `Record<string, any>` 行形状来处理业务表。

## UI 变更

对业务 UI 使用 React 和 FaasJS Ant Design 路径。

当 `@faasjs/ant-design` 包装器（如 `Form`、`Table`、`Description`、`Title`、`Tabs`、`Loading` 和 `ErrorBoundary`）能覆盖场景时优先使用它们。仅在包装器不合适或自定义 UI 更清晰时才降级到原始 Ant Design 组件。

保持页面级状态和请求流可读。在创建、更新或删除流程之后，有意刷新、关闭或失效受影响的界面并显示用户反馈。仅在组件被复用、创建了真正的边界或简化了大块代码时，才提取组件、hooks 或辅助函数。

## 测试

将 API 测试放在 API 文件夹的 `__tests__` 下。

对于非 API 测试，使用相同的功能本地布局原则：将 React、任务、辅助或集成测试放在它们所覆盖的页面、任务、工具或切片文件夹内的 `__tests__` 文件夹中，而不是集中到独立的包级测试树中。

测试定义切片的行为：

- 有效输入和预期输出
- 验证失败和重要的错误路径
- 相关的数据库写入、读取、排序和计数
- 当插件或范围查询影响 API 时的权限、租户或当前用户行为
- 当页面包含有意义的交互时的 UI 请求流

避免绕过 FaasJS 插件、验证或数据库行为的宽泛 mock，除非测试是有意限定在单元范围的。

## 代理工作流

当要求 AI 编码代理添加或更改功能时，描述切片而不是要求执行生成器命令。

好的提示模板：

```text
Add a users slice with a list page, create API, PostgreSQL migration, table types, and API tests. Follow the FaasJS curated stack and keep files near src/pages/users.
```

代理应该：

- 首先检查附近的切片和指南
- 创建或更新垂直行为所需的所有文件
- 当数据是用户或组织特定时，包含认证、租户和权限范围
- 将业务特定的关注点保留在应用代码或插件中
- 运行最小但有意义的测试
- 避免不相关的重构

## 为什么不是 Rails 风格的生成器

Rails 生成器帮助人类创建重复结构。FaasJS 假设 AI 编码代理可以在约定、示例、schema 和测试清晰的情况下直接编写该结构。

在添加生成器命令之前，先投资于更好的切片、示例和文档。仅在生成器明显改进了精心设计的路径且无法被更好的约定或示例取代时，才添加生成器。
