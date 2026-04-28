# 路由映射规范

## 背景

FaasJS 的 API 路由解析是基于文件系统的。这份规范标准化后端路由映射，
让 Zero-Mapping 继续保持显式：默认情况下，文件路径与请求路径一一对应。

前端页面组件仍然可以放在 `src/pages` 下，但 FaasJS 不再为 React
应用自动发现网页路由。浏览器路由属于应用自身关注点，不在这份规范范围内。

相关参考：

- `packages/core/src/server/routes.ts`
- `packages/core/src/server/routes.test.ts`
- `documents/projects/faasjs/rfc-spa-api-zero-mapping-v0.1-short.md`

## 目标

- 保持 API 位置能从请求路径直接推导，而不需要额外映射表。
- 降低人类与 AI coding agent 的歧义。
- 让后端路由搜索顺序保持可预测。

## 非目标

- 引入路径别名或 rewrite 层。
- 用注册表式路由替代文件系统路由。
- 在这个 V1 规范里增加 `[id]`、`[...slug]` 之类的动态文件名语法。
- 定义浏览器路由或 SPA 页面发现行为。

## 规范规则

### 1. 文件命名与放置位置

1. API 入口文件必须以 `.api.ts` 结尾。
2. 在 SPA 风格项目中，API 文件应放在 `api/` 目录下。
3. API 文件不得放在 `components/` 目录下。
4. 除 `*.api.ts` 外，其他文件不得隐式生成 API 路由。

### 2. Zero-Mapping 路由

1. 请求路径与文件路径必须保持直接映射（默认 Zero-Mapping）。
2. API 路由必须从 `src/` 下的完整路径建立映射；实现不得依赖诸如 `actions -> api` 之类的隐式 rewrite。
3. 实现不得增加会破坏路径 / 文件可预测性的隐藏别名路由。

### 3. API 路由文件搜索顺序

给定 API 请求路径 `<p>`，路由解析必须按以下顺序探测：

1. `<p>.api.ts`
2. `<p>/index.api.ts`
3. `<p>/default.api.ts`
4. 父级 fallback 链：从 `<parent>/default.api.ts` 一直回溯到根作用域

如果没有任何候选文件，则该请求视为 not found。

## 示例

| 文件                              | 路由                               |
| --------------------------------- | ---------------------------------- |
| `src/pages/todo/api/list.api.ts`  | `POST /pages/todo/api/list`        |
| `src/pages/todo/api/index.api.ts` | `POST /pages/todo/api`             |
| `src/pages/todo/default.api.ts`   | `/pages/todo/*` 的 fallback        |
| `src/pages/default.api.ts`        | `/pages/*` 下未匹配路由的 fallback |

API fallback 示例：

- Request: `POST /pages/todo/item/unknown`
- Probe order:
  1. `src/pages/todo/item/unknown.api.ts`
  2. `src/pages/todo/item/unknown/index.api.ts`
  3. `src/pages/todo/item/unknown/default.api.ts`
  4. `src/pages/todo/item/default.api.ts`
  5. `src/pages/todo/default.api.ts`
  6. `src/pages/default.api.ts`
