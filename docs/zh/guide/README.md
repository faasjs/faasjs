# 最佳实践

这里收录 FaasJS 当前公开维护的最佳实践与规范中文版。

FaasJS 是一个受 Rails 启发的精选式全栈 TypeScript 框架，面向数据库驱动的 React 业务应用。主路径包括 React、Ant Design、类型化 API、PostgreSQL、校验、测试、plugin 和稳定项目约定。

## 主路径

开始新功能，或让 AI coding agent 构建功能时，建议按以下顺序阅读：

1. [精选栈指南](/zh/guidelines/curated-stack.html)
2. [项目配置指南](/zh/guidelines/project-config.html)
3. [文件约定](/zh/guidelines/file-conventions.html)
4. [defineApi 指南](/zh/guidelines/define-api.html)
5. [React 数据请求指南](/zh/guidelines/react-data-fetching.html)
6. [Ant Design 指南](/zh/guidelines/ant-design.html)
7. [PG 查询构建与原生 SQL 指南](/zh/guidelines/pg-query-builder.html)
8. [PG Schema 与迁移指南](/zh/guidelines/pg-schema-and-migrations.html)
9. [PG 测试指南](/zh/guidelines/pg-testing.html)
10. [应用切片指南](/zh/guidelines/application-slices.html)

FaasJS 更重视完整应用切片，而不是 generator-heavy 工作流。一个切片应让 UI、API、校验、数据库变更和测试能被一起发现、评审和修改。

## 指南

- [精选栈指南](/zh/guidelines/curated-stack.html): 覆盖受 Rails 启发的默认栈、官方 React/Ant Design/PostgreSQL 路径、plugin 扩展边界、auth/权限范围和替换规则。
- [应用切片指南](/zh/guidelines/application-slices.html): 覆盖垂直 UI/API/数据库/测试切片、推荐文件布局、Agent 工作流，以及为什么 FaasJS 避免 generator-heavy 开发。
- [项目配置指南](/zh/guidelines/project-config.html): 如何让 `tsconfig.json`、`vite.config.ts` 与 FaasJS 的共享默认配置保持一致。
- [文件约定](/zh/guidelines/file-conventions.html): 页面、组件、hooks、`.api.ts` 与 `.job.ts` 文件应该放在哪里，以及何时值得拆文件。
- [代码注释指南](/zh/guidelines/code-comments.html): 导出内容的 JSDoc 要求、公开 JSDoc 的语言与 tags 约定、何时给内部 helper 补充简短注释，以及如何解释非常规实现的原因。
- [defineApi 指南](/zh/guidelines/define-api.html): 如何使用 `defineApi` 编写接口、内联 schema、typed params 与错误处理。
- [Jobs 指南](/zh/guidelines/jobs.html): 如何定义 `.job.ts` 后台任务、投递异步工作、启动 worker 与 scheduler，并处理重试和幂等。
- [测试指南](/zh/guidelines/testing.html): 覆盖通用测试分层、mock 边界和避免不必要 mock 的原则。
- [React 指南](/zh/guidelines/react.html): FaasJS 项目中的 React 组件、hooks、依赖处理与 `useEffect` 替代方案。
- [React 数据请求指南](/zh/guidelines/react-data-fetching.html): 何时使用 `useFaas`、`useFaasStream`、`faas`、`FaasDataWrapper` 或 `withFaasData`。
- [React 测试指南](/zh/guidelines/react-testing.html): 在共享测试指南基础上，如何用 `setMock`、共享清理与 `jsdom` 测试请求相关的 FaasJS React 代码。
- [Ant Design 指南](/zh/guidelines/ant-design.html): 基于 `@faasjs/ant-design` 的页面结构、路由、CRUD 组合与交互反馈。
- [Node Utils 指南](/zh/guidelines/node-utils.html): Node 环境下的配置加载、函数引导、模块装载与日志能力。
- [Logger 指南](/zh/guidelines/logger.html): 何时复用注入 logger、何时创建 `Logger` 实例，以及如何选择日志级别。
- [Utils 指南](/zh/guidelines/utils.html): 如何使用 `@faasjs/utils` 处理 `deepMerge` 与 stream 转换。
- [PG 查询构建与原生 SQL 指南](/zh/guidelines/pg-query-builder.html): 如何优先使用 `QueryBuilder` clauses、谨慎选择 raw SQL 回退、保持 client 引导路径一致，并有意识地收窄结果结构。
- [PG 表类型指南](/zh/guidelines/pg-table-types.html): 如何通过 `Tables` 声明合并维护具体行结构，并保持查询推导与表定义一致。
- [PG Schema 与迁移指南](/zh/guidelines/pg-schema-and-migrations.html): 如何使用时间戳 migrations、`SchemaBuilder`、`TableBuilder` 与事务性 schema 变更。
- [PG 测试指南](/zh/guidelines/pg-testing.html): 如何使用 `PgVitestPlugin()`、共享 `DATABASE_URL` 引导路径，并让运行时断言与 `expectTypeOf(...)` 配套。
- [CLI and Tooling 指南](/zh/guidelines/cli-and-tooling.html): 当你在运行 CLI 命令、排查命令错误或为任务选择合适的工具时，请使用这份指南。它是 FaasJS 工具链的快速参考，帮助减少命令执行错误。
- [CRUD Patterns 指南](/zh/guidelines/crud-patterns.html): 当你在 FaasJS 应用中实现或评审标准 CRUD 功能（列表、详情、创建、更新、删除）时，请使用这份指南。它涵盖了从 API endpoint 到 React 页面的完整垂直切片。
- [快速开始指南](/zh/guidelines/getting-started.html): 当你要启动一个新的 FaasJS 项目，或让新开发者加入现有 FaasJS 代码库时，请使用这份指南。它涵盖了完整的搭建流程、第一个功能以及日常开发工作流，让人类和 AI coding agent 都能快速上手。

## API 文档

- [文档总览](/doc/)
- [@faasjs/core](/doc/core/)
- [@faasjs/dev](/doc/dev/)
- [@faasjs/react](/doc/react/)
- [@faasjs/ant-design](/doc/ant-design/)
- [@faasjs/node-utils](/doc/node-utils/)
- [@faasjs/jobs](/doc/jobs/)
- [@faasjs/pg](/doc/pg/)
- [@faasjs/pg-dev](/doc/pg-dev/)
- [@faasjs/types](/doc/types/)
- [@faasjs/utils](/doc/utils/)
- [create-faas-app](/doc/create-faas-app/)
