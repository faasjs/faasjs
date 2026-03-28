[@faasjs/ant-design](../README.md) / TitleProps

# Interface: TitleProps

Props for the document-title helper component.

## Properties

### children?

> `optional` **children?**: `Element`

Existing element cloned with a `title` prop.

### h1?

> `optional` **h1?**: `boolean` \| \{ `className?`: `string`; `style?`: `CSSProperties`; \}

Whether to render an `h1`, or the props used to style that `h1`.

### plain?

> `optional` **plain?**: `boolean`

Whether to render plain text instead of returning `null`.

### separator?

> `optional` **separator?**: `string`

Separator used when joining title segments.

#### Default

```ts
' - '
```

### suffix?

> `optional` **suffix?**: `string`

Suffix appended to the generated document title.

### title

> **title**: `string` \| `string`[]

Title text or title segments used to update `document.title`.
