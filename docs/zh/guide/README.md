# 最佳实践

这里收录 FaasJS 当前公开维护的最佳实践与规范中文版，用来替换旧版教程内容。

这些页面同步自 `faasjs-best-practices`，适合作为构建 FaasJS 项目时的默认开发指南。

## 指南

- [项目配置指南](../guidelines/project-config.md): 如何让 `tsconfig.json`、`vite.config.ts` 与 FaasJS 的共享默认配置保持一致。
- [文件约定](../guidelines/file-conventions.md): 页面、组件、hooks 与 `.func.ts` 文件应该放在哪里，以及何时值得拆文件。
- [代码注释指南](../guidelines/code-comments.md): 导出内容的 JSDoc 要求、公开 JSDoc 的语言与 tags 约定、生成流程，以及如何解释非常规实现的原因。
- [defineApi 指南](../guidelines/define-api.md): 如何使用 `defineApi` 编写接口、内联 schema、typed params 与错误处理。
- [React 指南](../guidelines/react.md): FaasJS 项目中的 React 组件、hooks、依赖处理与 `useEffect` 替代方案。
- [React 数据请求指南](../guidelines/react-data-fetching.md): 何时使用 `useFaas`、`useFaasStream`、`faas`、`FaasDataWrapper` 或 `withFaasData`。
- [React 测试指南](../guidelines/react-testing.md): 如何用 `setMock`、共享清理与可观察行为测试 FaasJS React 代码。
- [Ant Design 指南](../guidelines/ant-design.md): 基于 `@faasjs/ant-design` 的页面结构、路由、CRUD 组合与交互反馈。
- [Node Utils 指南](../guidelines/node-utils.md): Node 环境下的配置加载、函数引导、模块装载与日志能力。
- [Logger 指南](../guidelines/logger.md): 何时复用注入 logger、何时创建 `Logger` 实例，以及如何选择日志级别。
- [Utils 指南](../guidelines/utils.md): 如何使用 `@faasjs/utils` 处理 `deepMerge` 与 stream 转换。

## 规范

- [faas.yaml 配置规范](../specs/faas-yaml.md): `faas.yaml` 的发现顺序、合并规则、`server` 节点约定与支持的 YAML 子集。
- [HTTP 协议规范](../specs/http-protocol.md): FaasJS 请求与响应的默认 HTTP 约定，以及错误返回格式。
- [Plugin 规范](../specs/plugin.md): 插件的标识、生命周期、配置合并与 `defineApi` 自动装载规则。
- [路由映射规范](../specs/routing-mapping.md): Zero-Mapping 路由规则、查找顺序与 `.func.ts` 文件约束。

## API 文档

- [文档总览](/doc/)
- [@faasjs/core](/doc/core/)
- [@faasjs/dev](/doc/dev/)
- [@faasjs/react](/doc/react/)
- [@faasjs/ant-design](/doc/ant-design/)
- [@faasjs/node-utils](/doc/node-utils/)
- [@faasjs/types](/doc/types/)
- [@faasjs/utils](/doc/utils/)
- [create-faas-app](/doc/create-faas-app/)
