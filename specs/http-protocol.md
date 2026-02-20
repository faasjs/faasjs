# HTTP Protocol Specification

Chinese: [HTTP 协议规范](./http-protocol.zh.md)

## Metadata

- Status: Accepted
- Version: v1.0
- Owner: FaasJS Maintainers
- Applies To: `@faasjs/react`, `@faasjs/core`, and API projects built on FaasJS
- Last Updated: 2026-02-19

## Background

FaasJS has historical request/response guidance in docs, but contracts are spread across multiple locations. This spec defines a single internal baseline for transport behavior.

Legacy references (kept unchanged in this phase):

- `docs/guide/request-spec.md`
- `docs/zh/guide/excel/request-spec.md`

## Goals

- Keep client/server interaction predictable across projects.
- Keep transport-level behavior aligned with current implementation, including low-level error fallback.
- Keep failure semantics simple in V1.

## Non-goals

- Defining REST resource modeling patterns.
- Defining GraphQL contracts.
- Standardizing file upload and stream protocol details.

## Normative Rules

### 1. Request

1. API requests MUST use `POST` as the default method.
2. Request body MUST be encoded as JSON text (`application/json; charset=UTF-8`) and SHOULD be a JSON object.
3. Query parameters SHOULD be avoided for business input; clients SHOULD send input in JSON body.
4. Request path MUST follow [routing-mapping.md](./routing-mapping.md).
5. Clients SHOULD include `X-FaasJS-Request-Id` for traceability when possible.

### 2. Response (transport layer)

1. The V1 status code baseline is `200`, `204`, and `500`.
2. `200` means request completed with a response body, and payload MUST use top-level `data`.
3. `204` means request completed with no content.
4. Business failures MUST return `500` in the V1 baseline.
5. For JSON error responses, payload MUST use top-level `error` with `error.message`.
6. For low-level server failures, `500` MAY return plain text `Internal Server Error` with `Content-Type: text/plain; charset=utf-8`.
7. JSON responses SHOULD use `Content-Type: application/json; charset=utf-8`.
8. This specification is HTTP-version agnostic and does not require a specific HTTP protocol version.

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

## Compatibility

- Current runtime behavior is consistent with top-level `data`/`error` wrapping in `@faasjs/core`.
- Current server fallback behavior can return plain-text `500 Internal Server Error` in low-level failures.
- Historical docs mention `action + params`; V1 standardizes direct JSON object request body for route-based APIs.
- Existing projects may return additional status codes in custom logic. Those are outside this V1 baseline.

## Migration Checklist

- [ ] New APIs use `POST` + JSON object body.
- [ ] Success responses use transport-level top `data`.
- [ ] Failure responses use `500` (JSON `error.message` when possible).
- [ ] Clients can handle both JSON and `text/plain` for `500`.
- [ ] Existing custom status codes are documented locally when retained.
