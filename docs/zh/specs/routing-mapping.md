# 路由映射规范

## 背景

FaasJS 的路由解析是基于文件系统的。这份规范把这种映射方式标准化，并明确 Zero-Mapping 是默认行为：文件路径与 URL 路径保持一一对应。

相关参考：

- `packages/core/src/server/routes.ts`
- `packages/core/src/server/__tests__/routes.test.ts`
- `documents/projects/faasjs/rfc-spa-api-zero-mapping-v0.1-short.md`

## 目标

- 让开发者无需额外映射表，也能从 URL 直接定位 API 位置。
- 减少人类与 AI coding agents 对路由规则的歧义。
- 让行为与当前 server 的路由查找顺序保持一致。

## 非目标

- 引入 path aliases 或 rewrite 层。
- 用注册表式路由替代文件系统路由。

## 规范性规则

### 1. 文件命名与放置位置

1. API 入口文件必须以 `.func.ts` 结尾。
2. 对 SPA 风格项目，API 文件应放在 `api/` 目录下。
3. API 文件不得放在 `components/` 目录下。

### 2. Zero-Mapping 路由

1. URL 路径与文件路径必须保持直接映射（默认采用 Zero-Mapping）。
2. 实现不得依赖诸如 `actions -> api` 这样的隐式 rewrite。
3. 实现不得增加会破坏路径 / 文件可预测性的隐藏 alias routes。

### 3. 路由文件查找顺序

给定请求路径 `<p>`，路由解析必须按以下顺序探测：

1. `<p>.func.ts`
2. `<p>/index.func.ts`
3. `<p>/default.func.ts`
4. 父级 fallback 链：`<parent>/default.func.ts`，一直回退到 root scope

如果所有候选都不存在，则该请求视为 not found。

## 示例

| 文件                               | 路由                               |
| ---------------------------------- | ---------------------------------- |
| `src/pages/todo/api/list.func.ts`  | `POST /pages/todo/api/list`        |
| `src/pages/todo/api/index.func.ts` | `POST /pages/todo/api`             |
| `src/pages/todo/default.func.ts`   | `/pages/todo/*` 的 fallback        |
| `src/pages/default.func.ts`        | `/pages/*` 下未匹配路由的 fallback |

Fallback 示例：

- Request: `POST /pages/todo/item/unknown`
- Probe order:
  1. `src/pages/todo/item/unknown.func.ts`
  2. `src/pages/todo/item/unknown/index.func.ts`
  3. `src/pages/todo/item/unknown/default.func.ts`
  4. `src/pages/todo/item/default.func.ts`
  5. `src/pages/todo/default.func.ts`
  6. `src/pages/default.func.ts`
