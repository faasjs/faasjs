# 路由映射规范

英文: [Routing Mapping Specification](./routing-mapping.md)

## 元信息

- 状态: 已采纳（Accepted）
- 版本: v1.0
- 维护者: FaasJS Maintainers
- 适用范围: `@faasjs/server`、`create-faas-app` 及基于 FaasJS 的 API 项目
- 最后更新: 2026-02-19

## 背景

FaasJS 路由解析基于文件系统。此规范用于固定映射规则，并明确 Zero-Mapping 默认约束：文件路径与 URL 路径一一对应。

相关参考：

- `packages/server/src/server/routes.ts`
- `packages/server/src/server/__tests__/routes.test.ts`
- `documents/projects/faasjs/rfc-spa-api-zero-mapping-v0.1-short.md`

## 目标

- 让接口文件可由 URL 直接定位，无需额外映射表。
- 降低人类开发者与 AI coding agent 的定位歧义。
- 与当前服务端候选路径搜索顺序保持一致。

## 非目标

- 不引入路径别名或重写层。
- 不改为注册表式路由系统。

## 规范条款

### 1. 文件命名与放置

1. API 入口文件必须以 `.func.ts` 结尾。
2. SPA 风格项目中的 API 文件应该放在 `api/` 目录下。
3. API 文件禁止放在 `components/` 目录下。

### 2. Zero-Mapping 路由

1. URL 路径与文件路径必须保持直接映射（默认 Zero-Mapping）。
2. 实现禁止依赖隐式重写（例如 `actions -> api`）。
3. 实现禁止增加破坏可预测性的隐藏别名路由。

### 3. 路由候选文件搜索顺序

给定请求路径 `<p>`，路由解析必须按以下顺序探测：

1. `<p>.func.ts`
2. `<p>/index.func.ts`
3. `<p>/default.func.ts`
4. 目录逐级回退：`<parent>/default.func.ts`，直到根范围

若所有候选都不存在，则视为未命中路由。

## 示例

| 文件 | 路由 |
| --- | --- |
| `src/pages/todo/api/list.func.ts` | `POST /todo/api/list` |
| `src/pages/todo/api/index.func.ts` | `POST /todo/api` |
| `src/pages/todo/default.func.ts` | `/todo/*` 的兜底 |
| `src/pages/default.func.ts` | `src/pages` 下未命中路径的兜底 |

回退示例：

- 请求：`POST /todo/item/unknown`
- 探测顺序：
  1. `src/pages/todo/item/unknown.func.ts`
  2. `src/pages/todo/item/unknown/index.func.ts`
  3. `src/pages/todo/item/unknown/default.func.ts`
  4. `src/pages/todo/item/default.func.ts`
  5. `src/pages/todo/default.func.ts`
  6. `src/pages/default.func.ts`

## 兼容性

- 现有项目中使用 `actions/` 命名的代码可继续运行，但新代码或迁移代码应该使用 `api/` 命名。
- 历史文档与 RFC 在本阶段保持不变。

## 迁移检查清单

- [ ] 清理应用层自定义路由重写/别名逻辑。
- [ ] 需要时将 `actions/` 目录迁移为 `api/`。
- [ ] 确认所有 API 文件均为 `.func.ts` 后缀。
- [ ] 确认 `components/` 下不存在 API 处理文件。
