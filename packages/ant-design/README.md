# @faasjs/ant-design

[![License: MIT](https://img.shields.io/npm/l/@faasjs/browser.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/browser/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/browser/stable.svg)](https://www.npmjs.com/package/@faasjs/browser)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/browser/beta.svg)](https://www.npmjs.com/package/@faasjs/browser)

UI components based on [FaasJS](https://faasjs.com) and [Ant Design](https://ant.design).

## Install

    npm install @faasjs/ant-design

## Usage

In `@faasjs/ant-design`, we use `FaasItemProps` to provide data structures for components.

```ts
type FaasItemType =
  'string' | 'string[]' |
  'number' | 'number[]' |
  'boolean'

type FaasItemProps = {
  type: FaasItemTypes
  id: string
  title?: string
}
```

### Component special props

Each component's props extends from `FaasItemProps` structures.

#### DescriptionItemProps

```ts
type DescriptionItemProps<T = any> = FaasItemProps & {
  content?: (props: {
    value: T
  }) => JSX.Element
}
```

#### FormItemProps

```ts
type FormItemProps<T = any> = AntdFormItemProps<T> & FaasItemProps & {
  input?: (args: {
    value?: T
    onChange?: (value: T) => void
  }) => JSX.Element
}
```

#### TableItemProps

```ts
type TableItemProps<T = any> = AntdTableColumnProps<T> & FaasItemProps
```
