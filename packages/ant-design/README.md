# @faasjs/ant-design

UI components based on [FaasJS](https://faasjs.com), [Ant Design](https://ant.design) and [React Router](https://reactrouter.com).

[![License: MIT](https://img.shields.io/npm/l/@faasjs/ant-design.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/ant-design/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/ant-design.svg)](https://www.npmjs.com/package/@faasjs/ant-design)

## Install

```sh
npm install @faasjs/ant-design
```

## Usage

In `@faasjs/ant-design`, we use `FaasItemProps` to provide data structures for components.

```ts
type FaasItemType =
  'string' | 'string[]' |
  'number' | 'number[]' |
  'boolean' |
  'date' | 'time' |
  'object' | 'object[]'

type FaasItemProps = {
  type: FaasItemTypes
  id: string
  title?: string
}
```

## Interfaces

- [AppProps](interfaces/AppProps.md)
- [BaseItemProps](interfaces/BaseItemProps.md)
- [BlankProps](interfaces/BlankProps.md)
- [ConfigProviderProps](interfaces/ConfigProviderProps.md)
- [DescriptionItemContentProps](interfaces/DescriptionItemContentProps.md)
- [DescriptionItemProps](interfaces/DescriptionItemProps.md)
- [DescriptionProps](interfaces/DescriptionProps.md)
- [DrawerProps](interfaces/DrawerProps.md)
- [ErrorBoundaryProps](interfaces/ErrorBoundaryProps.md)
- [ExtendDescriptionTypeProps](interfaces/ExtendDescriptionTypeProps.md)
- [FaasDataWrapperProps](interfaces/FaasDataWrapperProps.md)
- [FaasItemProps](interfaces/FaasItemProps.md)
- [FormItemProps](interfaces/FormItemProps.md)
- [FormProps](interfaces/FormProps.md)
- [LinkProps](interfaces/LinkProps.md)
- [ModalProps](interfaces/ModalProps.md)
- [RoutesProps](interfaces/RoutesProps.md)
- [TabProps](interfaces/TabProps.md)
- [TableItemProps](interfaces/TableItemProps.md)
- [TabsProps](interfaces/TabsProps.md)
- [TitleProps](interfaces/TitleProps.md)
- [UnionFaasItemProps](interfaces/UnionFaasItemProps.md)
- [useAppProps](interfaces/useAppProps.md)

## Type Aliases

- [BaseOption](type-aliases/BaseOption.md)
- [ExtendDescriptionItemProps](type-aliases/ExtendDescriptionItemProps.md)
- [ExtendFormItemProps](type-aliases/ExtendFormItemProps.md)
- [ExtendFormTypeProps](type-aliases/ExtendFormTypeProps.md)
- [ExtendTableItemProps](type-aliases/ExtendTableItemProps.md)
- [ExtendTableTypeProps](type-aliases/ExtendTableTypeProps.md)
- [ExtendTypes](type-aliases/ExtendTypes.md)
- [FaasDataInjection](type-aliases/FaasDataInjection.md)
- [FaasItemType](type-aliases/FaasItemType.md)
- [FaasItemTypeValue](type-aliases/FaasItemTypeValue.md)
- [FormSubmitProps](type-aliases/FormSubmitProps.md)
- [LoadingProps](type-aliases/LoadingProps.md)
- [TableProps](type-aliases/TableProps.md)
- [UnionFaasItemElement](type-aliases/UnionFaasItemElement.md)
- [UnionFaasItemInjection](type-aliases/UnionFaasItemInjection.md)
- [UnionFaasItemRender](type-aliases/UnionFaasItemRender.md)
- [UnionScene](type-aliases/UnionScene.md)
- [setDrawerProps](type-aliases/setDrawerProps.md)
- [setModalProps](type-aliases/setModalProps.md)

## Variables

- [ConfigContext](variables/ConfigContext.md)

## Functions

- [App](functions/App.md)
- [Blank](functions/Blank.md)
- [ConfigProvider](functions/ConfigProvider.md)
- [Description](functions/Description.md)
- [Drawer](functions/Drawer.md)
- [ErrorBoundary](functions/ErrorBoundary.md)
- [FaasDataWrapper](functions/FaasDataWrapper.md)
- [Form](functions/Form.md)
- [FormItem](functions/FormItem.md)
- [Link](functions/Link.md)
- [Loading](functions/Loading.md)
- [Modal](functions/Modal.md)
- [PageNotFound](functions/PageNotFound.md)
- [Routes](functions/Routes.md)
- [Table](functions/Table.md)
- [Tabs](functions/Tabs.md)
- [Title](functions/Title.md)
- [faas](functions/faas.md)
- [transferOptions](functions/transferOptions.md)
- [transferValue](functions/transferValue.md)
- [useApp](functions/useApp.md)
- [useConfigContext](functions/useConfigContext.md)
- [useDrawer](functions/useDrawer.md)
- [useFaas](functions/useFaas.md)
- [useModal](functions/useModal.md)
