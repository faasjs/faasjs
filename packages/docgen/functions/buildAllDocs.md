[@faasjs/docgen](../README.md) / buildAllDocs

# Function: buildAllDocs()

> **buildAllDocs**(`options?`): `void`

Run the full docs sync workflow for the repository.

The workflow runs package API generation, prepares the docs site content, then runs
`vp check --fix`, which may format generated and source files.

## Parameters

### options?

[`DocgenOptions`](../type-aliases/DocgenOptions.md) = `{}`

Repository root override.

## Returns

`void`
