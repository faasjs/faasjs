# HTTP 协议规范

## 背景

FaasJS 的请求 / 响应说明分散在多个位置。这份规范定义了一个统一的内部基线，用来描述传输层行为。

## 目标

- 保持跨项目的 client / server 交互可预测。
- 保持传输层行为与当前实现一致，包括底层错误 fallback。
- 在 V1 中保持失败语义简单清晰。

## 非目标

- 定义 REST 资源建模模式。
- 定义 GraphQL 协议。
- 标准化文件上传与 stream 协议细节。

## 规范性规则

### 1. Request

1. API 请求默认必须使用 `POST`。
2. 请求体必须编码为 JSON 文本（`application/json; charset=UTF-8`），并且应是 JSON 对象。
3. 对业务输入应避免使用 query parameters；client 应通过 JSON body 传参。
4. 请求路径必须遵循 [routing-mapping.md](./routing-mapping.md)。
5. 在可能的情况下，client 应附带 `X-FaasJS-Request-Id` 以便追踪。

### 2. Response（传输层）

1. V1 的状态码基线是 `200`、`204` 和 `500`。
2. `200` 表示请求成功且带有响应体，载荷必须使用顶层 `data`。
3. `204` 表示请求成功但没有内容。
4. 在 V1 基线中，业务失败必须返回 `500`。
5. 对 JSON 错误响应，载荷必须使用顶层 `error`，并带 `error.message`。
6. 对底层 server 故障，`500` 可以返回纯文本 `Internal Server Error`，并带 `Content-Type: text/plain; charset=utf-8`。
7. JSON 响应应使用 `Content-Type: application/json; charset=utf-8`。
8. 这份规范与 HTTP 版本无关，不要求固定的 HTTP 协议版本。

## 示例

### Request

```http
POST /todo/api/create
Content-Type: application/json; charset=UTF-8

{"title":"Buy milk"}
```

### Response: 200 success

```json
{
  "data": {
    "id": 1,
    "title": "Buy milk"
  }
}
```

### Response: 500 business/runtime error (JSON)

```json
{
  "error": {
    "message": "business-500"
  }
}
```

### Response: 500 low-level server error (plain text)

```text
500 Internal Server Error
Content-Type: text/plain; charset=utf-8

Internal Server Error
```

### Response: 500 transport/runtime error (JSON)

```json
{
  "error": {
    "message": "Internal Server Error"
  }
}
```

## 当前实现说明

- 当前运行时行为与 `@faasjs/core` 中顶层 `data` / `error` 包裹约定一致。
- 当前 server fallback 行为在底层故障时可能返回纯文本 `500 Internal Server Error`。
- 现有项目在自定义逻辑中可能返回额外状态码；这些不属于本 V1 基线范围。
