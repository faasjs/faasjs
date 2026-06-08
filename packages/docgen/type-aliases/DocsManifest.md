[@faasjs/docgen](../README.md) / DocsManifest

# Type Alias: DocsManifest

> **DocsManifest** = `object`

Docs site manifest generated from source guides and package metadata.

## Properties

### packages

> **packages**: `string`[]

Sorted package slugs included in the API docs index; `docgen` is intentionally excluded.

### pages

> **pages**: [`ManifestPage`](ManifestPage.md)[]

Source pages included in the generated docs site.
