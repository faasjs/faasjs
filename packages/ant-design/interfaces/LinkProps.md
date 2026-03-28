[@faasjs/ant-design](../README.md) / LinkProps

# Interface: LinkProps

Props for the navigation-aware [Link](../functions/Link.md) component.

## Properties

### block?

> `optional` **block?**: `boolean`

Whether the rendered link or button should take the full width.

### button?

> `optional` **button?**: `boolean` \| `ButtonProps`

Button mode config, or `true` to render with default Ant Design button props.

### children?

> `optional` **children?**: `ReactNode`

Custom link content rendered instead of `text`.

### copyable?

> `optional` **copyable?**: `boolean`

Whether plain-text links should enable the Typography copy action.

### href

> **href**: `string`

Target URL or route path.

### onClick?

> `optional` **onClick?**: (`event`) => `void`

Custom click handler that overrides the built-in navigation behavior.

#### Parameters

##### event

`MouseEvent`\<`HTMLElement`, `MouseEvent`\>

#### Returns

`void`

### style?

> `optional` **style?**: `CSSProperties`

Inline styles merged with the theme defaults.

### target?

> `optional` **target?**: `"_blank"`

Explicit link target. Absolute HTTP URLs default to `_blank`.

### text?

> `optional` **text?**: `string` \| `number`

Text rendered when `children` is not provided.
