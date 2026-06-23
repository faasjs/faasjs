[@faasjs/docgen](../README.md) / prepareDocsSite

# Function: prepareDocsSite()

> **prepareDocsSite**(`options?`): `void`

Prepare generated docs-site Markdown from source guides and package API docs.

This rewrites generated content under `docs/guidelines`, `docs/zh`, and `docs/doc`,
injects public guide/spec links from plain source references, copies package Markdown
except `packages/docgen/**`, and refreshes guide and spec indexes.

## Parameters

### options?

[`DocgenOptions`](../type-aliases/DocgenOptions.md) = `{}`

Repository root override.

## Returns

`void`
