# HTTP 协议规范

英文: [HTTP Protocol Specification](./http-protocol.md)

## 元信息

- 状态: 已采纳（Accepted）
- 版本: v1.0
- 维护者: FaasJS Maintainers
- 适用范围: `@faasjs/react`、`@faasjs/core` 及基于 FaasJS 的 API 项目
- 最后更新: 2026-02-19

## 背景

FaasJS 现有请求/响应约定分散在多个文档中。此规范用于在仓库内建立统一的传输层基线。

历史参考（本阶段保持不变）：

- `docs/guide/request-spec.md`
- `docs/zh/guide/excel/request-spec.md`

## 目标

- 让跨项目的客户端/服务端交互可预测。
- 与当前实现保持一致，并覆盖底层异常时的兜底行为。
- 在 V1 中保持失败语义简单明确。

## 非目标

- 不定义 REST 资源建模策略。
- 不定义 GraphQL 契约。
- 不覆盖文件上传与流式传输的细节协议。

## 规范条款

### 1. 请求

1. API 请求默认必须使用 `POST`。
2. 请求体必须使用 JSON 文本编码（`application/json; charset=UTF-8`），并且应该为 JSON 对象。
3. 业务入参应该避免放在 Query 中，优先放在 JSON Body。
4. 请求路径必须遵循 [routing-mapping.md](./routing-mapping.md)。
5. 客户端在可行时应该传递 `X-FaasJS-Request-Id` 便于链路追踪。

### 2. 响应（传输层）

1. V1 状态码基线为 `200`、`204`、`500`。
2. `200` 表示请求成功且有响应体，返回体必须使用顶层 `data`。
3. `204` 表示请求成功且无内容。
4. V1 基线下，业务失败必须返回 `500`。
5. 当错误响应为 JSON 时，返回体必须使用顶层 `error` 且包含 `error.message`。
6. 服务底层异常时，`500` 可以返回纯文本 `Internal Server Error`，并使用 `Content-Type: text/plain; charset=utf-8`。
7. JSON 响应应该使用 `Content-Type: application/json; charset=utf-8`。
8. 本规范与 HTTP 版本无关，不要求特定协议版本。

## 示例

### 请求

```http
POST /todo/api/create
Content-Type: application/json; charset=UTF-8

{"title":"Buy milk"}
```

### 响应：200（成功）

```json
{
  "data": {
    "id": 1,
    "title": "Buy milk"
  }
}
```

### 响应：500（业务/运行时错误，JSON）

```json
{
  "error": {
    "message": "business-500"
  }
}
```

### 响应：500（服务底层错误，纯文本）

```text
500 Internal Server Error
Content-Type: text/plain; charset=utf-8

Internal Server Error
```

### 响应：500（传输层/运行时错误，JSON）

```json
{
  "error": {
    "message": "Internal Server Error"
  }
}
```

## 兼容性

- 当前 `@faasjs/core` 中 HTTP 插件的实现使用顶层 `data`/`error` 包装，与本规范一致。
- 当前服务端在底层异常场景下，可能返回纯文本 `500 Internal Server Error`。
- 历史文档曾提到 `action + params`；V1 对路由式 API 统一为“直接 JSON 对象”请求体。
- 现有项目若返回了其它状态码，属于本版基线之外，需要在项目文档中单独说明。

## 迁移检查清单

- [ ] 新 API 使用 `POST` + JSON 对象请求体。
- [ ] 成功响应使用传输层顶层 `data`。
- [ ] 失败响应使用 `500`（可 JSON 时使用 `error.message`）。
- [ ] 客户端能同时处理 `500` 的 JSON 与 `text/plain` 两种形式。
- [ ] 保留自定义状态码时补充项目内说明文档。
