[@faasjs/docgen](../README.md) / prepareDocsSite

# Function: prepareDocsSite()

> **prepareDocsSite**(`options?`): `void`

Prepare generated docs-site Markdown from source guides and package API docs.

This rewrites generated content under `docs/guidelines`, `docs/zh`, and `docs/doc`,
copies package Markdown except `packages/docgen/**`, and refreshes guide indexes.

## Parameters

### options?

[`DocgenOptions`](../type-aliases/DocgenOptions.md) = `{}`

Repository root override.

## Returns

`void`
