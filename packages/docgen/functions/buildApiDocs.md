[@faasjs/docgen](../README.md) / buildApiDocs

# Function: buildApiDocs()

> **buildApiDocs**(`options?`): `void`

Generate package API Markdown from source JSDoc using TypeDoc.

By default this regenerates API docs for packages with a `types` entry, excluding
`create-faas-app` and `docgen`. Pass `packagePath` to target one package. Existing
generated API folders are removed before TypeDoc runs.

## Parameters

### options?

[`DocgenOptions`](../type-aliases/DocgenOptions.md) & `object` = `{}`

Repository root and optional target package path.

## Returns

`void`

## Throws

When TypeDoc or filesystem operations fail.
