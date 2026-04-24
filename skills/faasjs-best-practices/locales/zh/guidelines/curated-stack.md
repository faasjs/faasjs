# 精选栈指南

当你选择默认方案、评审架构，或让 AI coding agent 构建 FaasJS 功能时，请使用本指南。

FaasJS 是一个受 Rails 启发的精选式全栈 TypeScript 框架，面向数据库驱动的 React 业务应用。它提供一条大厨精选式主路径，而不是让每个团队从零拼装自己的框架。

## 默认栈

FaasJS 的精选路径包括：

- React 用于前端应用
- `@faasjs/ant-design` 和 Ant Design 用于业务 UI
- PostgreSQL 用于关系型数据
- `@faasjs/pg` 用于类型化数据库查询、迁移和表类型推导
- `defineApi` 用于类型化后端接口
- 在用户输入和外部请求等系统边界使用 schema validation
- 基于 Vitest 的测试，包括用 `@faasjs/pg-dev` 测试 PostgreSQL 工作流
- Vite Plus 用于开发和构建工具链
- plugin 用于业务特定扩展点
- 人类和 AI coding agent 都能遵循的稳定文件约定和示例

管理后台、back-office 系统、内部工具、SaaS dashboard、BFF/API 层和业务流程系统应优先采用这条路径。

## React 是官方前端路径

FaasJS 前端应用应使用 React。

除非能明确改善精选 React 路径，否则不要把另一个前端框架加入为官方等价路径。用户项目可以尝试替代前端栈，但它们不应驱动 core API、模板或默认文档。

## Ant Design 是业务 UI 路径

常见业务 UI 需求应使用 `@faasjs/ant-design`，包括页面、路由、表单、表格、描述列表、加载状态和反馈。

当 FaasJS Ant Design wrapper 覆盖场景时，优先使用 wrapper，而不是围绕原始 Ant Design 组件手写胶水代码。这样能让业务 UI 代码更可预测，也更容易被 Agent 生成和评审。

## PostgreSQL 是关系数据路径

数据库驱动的应用工作应通过 `@faasjs/pg` 使用 PostgreSQL。

优先使用类型化 query builder、显式 returning columns、具体表声明、时间戳 migrations 和 `@faasjs/pg-dev` 测试。不要为了数据库中立抽象重塑 core 设计，除非该变化也能改善 PostgreSQL 主路径。

## 类型化 API 与校验

后端接口应使用 `defineApi`，并在系统边界进行请求校验。

优先把 schema 放在 API handler 附近，保持明确的 params 和 response 结构，并用测试覆盖运行时行为和重要类型预期。不要用隐式行为或宽泛的无类型 helper 隐藏 API 契约。

## Plugin 是业务扩展点

项目特定的横切关注点应使用 plugin，例如 auth context、权限、租户上下文、请求元信息、服务客户端或定时任务。

Plugin 应让扩展点保持显式，但不要把 FaasJS 变成配置繁重的框架。业务规则应保留在应用代码或 plugin 中，而不是推入 core packages。

## Auth 与权限

不要把 auth 或权限视为 FaasJS core 内置功能。

生产 auth 会因密码登录、SSO、OAuth、session、JWT、多租户、RBAC、ABAC 和产品特定安全策略而差异巨大。starter 或示例可以展示简单 auth plugin pattern，但它只是用于说明如何注入当前用户上下文和保护 API，不是强制 auth 系统。

## 替换路径

团队可以替换精选栈中的部分选择，但替换路径是逃逸口，不是并列的一等路线。

评审 proposal 时，不要只为了支持替代 UI 库、数据库、校验策略或架构风格而增加 core 复杂度。只有当替换相关变化也能让精选主路径更清晰、更安全或更易维护时，才应接受。

## Agent 可读的应用开发

FaasJS 不依赖 Rails-style generators 作为主要生产力机制。

相反，应让文件结构、示例、测试、schema 和类型化契约足够可预测，使 AI coding agent 可以直接创建和修改完整应用切片。当重复代码能让评审和生成更安全时，应优先选择清晰重复，而不是聪明抽象。
