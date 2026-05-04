# HTTP Protocol Specification

## Background

FaasJS request/response behavior is documented across several locations. This specification defines a unified internal baseline for transport-layer behavior.

## Goals

- Keep client/server interaction predictable across projects.
- Keep transport-layer behavior consistent with the current implementation, including low-level error fallbacks.
- Keep failure semantics simple and clear in V1.

## Non-Goals

- Define REST resource modeling patterns.
- Define GraphQL protocol.
- Standardize file upload and stream protocol details.

## Normative Rules

### 1. Request

1. API requests MUST use `POST` by default.
2. The request body MUST be encoded as JSON text (`application/json; charset=UTF-8`) and MUST be a JSON object.
3. Avoid query parameters for business input; clients SHOULD pass parameters via the JSON body.
4. The request path MUST follow [routing-mapping.md](./routing-mapping.md).
5. When possible, clients SHOULD include `X-FaasJS-Request-Id` for tracing.

### 2. Response (Transport Layer)

1. The V1 status code baseline is `200`, `204`, and `500`.
2. `200` indicates a successful request with a response body; the payload MUST use a top-level `data` key.
3. `204` indicates a successful request with no content.
4. In the V1 baseline, business failures MUST return `500`.
5. For JSON error responses, the payload MUST use a top-level `error` key with `error.message`.
6. For low-level server failures, `500` MAY return plain text `Internal Server Error` with `Content-Type: text/plain; charset=utf-8`.
7. JSON responses SHOULD use `Content-Type: application/json; charset=utf-8`.
8. This specification is HTTP-version-agnostic and does not require a fixed HTTP protocol version.

## Examples

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

## Current Implementation Notes

- Current runtime behavior aligns with the top-level `data`/`error` wrapping convention in `@faasjs/core`.
- Current server fallback behavior MAY return a plain text `500 Internal Server Error` on low-level failures.
- Existing projects MAY return additional status codes in custom logic; these are outside the scope of this V1 baseline.
