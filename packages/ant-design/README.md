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

### Form

Form are based on [Ant Design's Form component](https://ant.design/components/form/#Form).

<iframe src="https://codesandbox.io/embed/recursing-lumiere-8wn11" style="width:100%;height:500px;border:0;overflow:hidden;" title="faasjs-ant-design-form" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

### FormItem

Form are based on [Ant Design's Form.Item component](https://ant.design/components/form/#Form.Item).

<iframe src="https://codesandbox.io/embed/faasjs-ant-design-formitem-olqg5" style="width:100%;height:500px;border:0;overflow:hidden;" title="faasjs-ant-design-formitem" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>
