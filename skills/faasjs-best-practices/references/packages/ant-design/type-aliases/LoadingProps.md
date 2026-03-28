[@faasjs/ant-design](../README.md) / LoadingProps

# Type Alias: LoadingProps

> **LoadingProps** = `object`

Props for the [Loading](../functions/Loading.md) component.

## Properties

### children?

> `optional` **children?**: `React.ReactNode`

Content rendered when `loading` is `false`.

### loading?

> `optional` **loading?**: `boolean`

Whether the loading indicator should be shown.

#### Default

```ts
true
```

### size?

> `optional` **size?**: `"small"` \| `"default"` \| `"large"`

Ant Design spinner size.

#### Default

```ts
'large'
```

### style?

> `optional` **style?**: `React.CSSProperties`

Inline styles applied to the loading wrapper.
