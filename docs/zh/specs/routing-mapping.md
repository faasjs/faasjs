# 路由映射规范

## 背景

FaasJS 的路由解析是基于文件系统的。这份规范同时标准化 API 路由与网页路由，让 Zero-Mapping 继续保持显式：默认情况下，文件路径与 URL 路径一一对应。

相关参考：

- `packages/core/src/server/routes.ts`
- `packages/core/src/server/__tests__/routes.test.ts`
- `documents/projects/faasjs/rfc-spa-api-zero-mapping-v0.1-short.md`

## 目标

- 保持 API 与网页位置都能从 URL 直接推导，而不需要额外映射表。
- 降低人类与 AI coding agent 的歧义。
- 让网页渲染与 API 处理时的路由搜索顺序保持可预测。

## 非目标

- 引入路径别名或 rewrite 层。
- 用注册表式路由替代文件系统路由。
- 在这个 V1 规范里增加 `[id]`、`[...slug]` 之类的动态文件名语法。
- 要求为自动发现的页面额外维护独立路由配置文件。

## 规范规则

### 1. 文件命名与放置位置

1. 网页路由根目录必须是 `src/pages`。
2. 网页入口文件必须命名为 `index.tsx` 或 `default.tsx`。
3. 网页入口文件必须默认导出页面组件。
4. 名为 `api/` 的目录保留给后端路由文件使用，不得生成网页路由。
5. API 入口文件必须以 `.func.ts` 结尾。
6. API 文件在 SPA 风格项目中应放在 `api/` 目录下。
7. API 文件不得放在 `components/` 目录下。
8. 除 `index.tsx`、`default.tsx` 与 `*.func.ts` 外，其他文件不得隐式生成路由。

### 2. Zero-Mapping 路由

1. URL 路径与文件路径必须保持直接映射（默认 Zero-Mapping）。
2. 网页路由相对于 `src/pages` 建立映射，不得使用 `/pages` URL 前缀。这些路由用于 `GET`、`HEAD` 等网页请求。
3. API 路由仍然从 `src/` 下的完整路径建立映射；实现不得依赖诸如 `actions -> api` 之类的隐式 rewrite。
4. 实现不得增加会破坏路径 / 文件可预测性的隐藏别名路由。

### 3. 网页路由文件搜索顺序

给定浏览器路径 `<p>`，网页路由解析必须按以下顺序探测：

1. `src/pages<p>/index.tsx`
2. `src/pages<p>/default.tsx`
3. 父级 fallback 链：从 `src/pages<parent>/default.tsx` 一直回溯到 `src/pages/default.tsx`

对 `/` 进行规范化后，首个探测目标是 `src/pages/index.tsx`。

如果没有任何候选文件，则该请求视为 not found。
`default.tsx` 会在精确 `index.tsx` 查找失败后，作为当前作用域及其子作用域的 fallback。

### 4. 页面模块契约

1. 网页路由模块必须默认导出页面组件。
2. 路由解析必须只依赖被发现的文件路径与默认导出。
3. 可以存在具名导出，但它们不得影响路由匹配或页面渲染语义。
4. 这个 V1 网页路由规范不得要求动态文件名语法；嵌套路由只通过目录层级加 `index.tsx` / `default.tsx` 表达。

### 5. API 路由文件搜索顺序

给定 API 请求路径 `<p>`，路由解析必须按以下顺序探测：

1. `<p>.func.ts`
2. `<p>/index.func.ts`
3. `<p>/default.func.ts`
4. 父级 fallback 链：从 `<parent>/default.func.ts` 一直回溯到根作用域

如果没有任何候选文件，则该请求视为 not found。

## 示例

### 网页

| 文件                         | 路由                                                              |
| ---------------------------- | ----------------------------------------------------------------- |
| `src/pages/index.tsx`        | `GET /`                                                           |
| `src/pages/about/index.tsx`  | `GET /about`                                                      |
| `src/pages/docs/default.tsx` | 在精确页面查找失败后，作为 `/docs` 与未匹配 `/docs/*` 的 fallback |
| `src/pages/default.tsx`      | 未匹配网页路由的全局 fallback                                     |

网页 fallback 示例：

- Request: `GET /docs/react/routing`
- Probe order:
  1. `src/pages/docs/react/routing/index.tsx`
  2. `src/pages/docs/react/routing/default.tsx`
  3. `src/pages/docs/react/default.tsx`
  4. `src/pages/docs/default.tsx`
  5. `src/pages/default.tsx`

### API

| 文件                               | 路由                               |
| ---------------------------------- | ---------------------------------- |
| `src/pages/todo/api/list.func.ts`  | `POST /pages/todo/api/list`        |
| `src/pages/todo/api/index.func.ts` | `POST /pages/todo/api`             |
| `src/pages/todo/default.func.ts`   | `/pages/todo/*` 的 fallback        |
| `src/pages/default.func.ts`        | `/pages/*` 下未匹配路由的 fallback |

API fallback 示例：

- Request: `POST /pages/todo/item/unknown`
- Probe order:
  1. `src/pages/todo/item/unknown.func.ts`
  2. `src/pages/todo/item/unknown/index.func.ts`
  3. `src/pages/todo/item/unknown/default.func.ts`
  4. `src/pages/todo/item/default.func.ts`
  5. `src/pages/todo/default.func.ts`
  6. `src/pages/default.func.ts`
