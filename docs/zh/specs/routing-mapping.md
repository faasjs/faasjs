# 路由映射规范

## 背景

FaasJS 的路由解析是基于文件系统的。这份规范同时标准化 API 路由与网页路由，并明确 Zero-Mapping 是默认行为：文件路径与 URL 路径默认保持一一对应。

相关参考：

- `packages/core/src/server/routes.ts`
- `packages/core/src/server/__tests__/routes.test.ts`
- `documents/projects/faasjs/rfc-spa-api-zero-mapping-v0.1-short.md`

## 目标

- 让开发者无需额外映射表，也能从 URL 直接定位 API 和网页位置。
- 减少人类与 AI coding agents 对路由规则的歧义。
- 让服务端渲染与 API 处理的路由查找顺序保持可预测。

## 非目标

- 引入 path aliases 或 rewrite 层。
- 用注册表式路由替代文件系统路由。
- 在这个 V1 规范里加入 `[id]`、`[...slug]` 这类动态文件名语法。
- 为自动发现的页面额外要求一份独立的路由配置文件。

## 规范性规则

### 1. 文件命名与放置位置

1. 网页路由根目录必须是 `src/pages`。
2. 网页入口文件必须命名为 `index.tsx` 或 `default.tsx`。
3. 网页入口文件必须使用默认导出页面组件。
4. 名为 `api/` 的目录保留给后端路由文件使用，不得生成网页路由。
5. API 入口文件必须以 `.func.ts` 结尾。
6. 对 SPA 风格项目，API 文件应放在 `api/` 目录下。
7. API 文件不得放在 `components/` 目录下。
8. 除 `index.tsx`、`default.tsx` 与 `*.func.ts` 之外，其他文件不得隐式生成路由。

### 2. Zero-Mapping 路由

1. URL 路径与文件路径必须保持直接映射（默认采用 Zero-Mapping）。
2. 网页路由以 `src/pages` 为相对根目录映射，URL 不得带 `/pages` 前缀。这些路由用于 `GET`、`HEAD` 等网页请求。
3. API 路由继续从 `src/` 下的完整路径映射；实现不得依赖诸如 `actions -> api` 这样的隐式 rewrite。
4. 实现不得增加会破坏路径 / 文件可预测性的隐藏 alias routes。

### 3. 网页路由文件查找顺序

给定浏览器路径 `<p>`，网页路由解析必须按以下顺序探测：

1. `src/pages<p>/index.tsx`
2. `src/pages<p>/default.tsx`
3. 父级 fallback 链：`src/pages<parent>/default.tsx`，一直回退到 `src/pages/default.tsx`

对于 `/`，首个探测路径应规范化为 `src/pages/index.tsx`。

如果所有候选都不存在，则该请求视为 not found。
`default.tsx` 表示当前作用域及其子路径的 fallback，但只有在精确 `index.tsx` 查找未命中后才会生效。

### 4. 页面模块契约

1. 网页路由模块可以导出异步 `loader`。
2. 当 `loader` 存在时，必须在服务端对匹配页面执行 SSR 前运行它。
3. `loader` 必须接收路由上下文，其中至少包含 `pathname`、`query`、`basePath` 与 `restPath`。实现也可以额外提供原始 request/response 对象与日志工具。
4. `loader` 的返回结果必须可序列化，以便客户端 hydration 复用。
5. `loader` 可以返回 `props`、`statusCode` 与 `headers`。
6. 当 `loader` 返回 `props` 时，这些 props 必须传给页面组件用于 SSR，并在 hydration 时复用。
7. 这个 V1 网页路由规范不得要求动态文件名语法；嵌套路由仅通过目录层级加 `index.tsx` 与 `default.tsx` 表达。

### 5. API 路由文件查找顺序

给定 API 请求路径 `<p>`，路由解析必须按以下顺序探测：

1. `<p>.func.ts`
2. `<p>/index.func.ts`
3. `<p>/default.func.ts`
4. 父级 fallback 链：`<parent>/default.func.ts`，一直回退到 root scope

如果所有候选都不存在，则该请求视为 not found。

## 示例

### 网页

| 文件                         | 路由                                                            |
| ---------------------------- | --------------------------------------------------------------- |
| `src/pages/index.tsx`        | `GET /`                                                         |
| `src/pages/about/index.tsx`  | `GET /about`                                                    |
| `src/pages/docs/default.tsx` | 在精确页面未命中后，作为 `/docs` 与未匹配 `/docs/*` 的 fallback |
| `src/pages/default.tsx`      | 未匹配网页路由的全局 fallback                                   |

网页 fallback 示例：

- Request: `GET /docs/react/ssr`
- Probe order:
  1. `src/pages/docs/react/ssr/index.tsx`
  2. `src/pages/docs/react/ssr/default.tsx`
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
