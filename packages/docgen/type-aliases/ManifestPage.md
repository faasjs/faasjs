[@faasjs/docgen](../README.md) / ManifestPage

# Type Alias: ManifestPage

> **ManifestPage** = `object`

Manifest record for one source Markdown page.

## Properties

### kind

> **kind**: [`ManifestPageKind`](ManifestPageKind.md)

Page category.

### locale

> **locale**: [`ManifestLocale`](ManifestLocale.md)

Page locale.

### outputPath

> **outputPath**: `string`

Generated Markdown path relative to the repository root.

### routePath

> **routePath**: `string`

Docs-site route derived from the generated output path.

### slug

> **slug**: `string`

URL-friendly slug derived from the source filename.

### sourceContent

> **sourceContent**: `string`

Raw source Markdown content.

### sourcePath

> **sourcePath**: `string`

Source Markdown path relative to the repository root.

### summary

> **summary**: `string`

Short summary read from the page body or configured override.

### title

> **title**: `string`

Page title, usually read from the first Markdown heading.
