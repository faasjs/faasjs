# @faasjs/ant-design

# @faasjs/ant-design

React UI primitives and data-aware helpers for building FaasJS applications with Ant Design.

`@faasjs/ant-design` combines FaasJS request helpers and Ant Design components behind a
single public entrypoint.

## Install

```sh
npm install @faasjs/ant-design
```

## Highlights

- Use [App](functions/App.md) to wire Ant Design feedback APIs and FaasJS config providers.
- Use [Form](functions/Form.md), [Description](functions/Description.md), and [Table](functions/Table.md) with shared FaasJS item metadata.
- Use [faas](functions/faas.md), [useFaas](functions/useFaas.md), [useFaasStream](functions/useFaasStream.md), [FaasDataWrapper](functions/FaasDataWrapper.md), or [withFaasData](functions/withFaasData.md) to bind UI to FaasJS actions.

## Usage

```tsx
import { App, Form } from '@faasjs/ant-design'

export default function Page() {
  return (
    <App>
      <Form items={[{ id: 'name', required: true }]} />
    </App>
  )
}
```

## Functions

- [App](functions/App.md)
- [Blank](functions/Blank.md)
- [cloneUnionFaasItemElement](functions/cloneUnionFaasItemElement.md)
- [ConfigProvider](functions/ConfigProvider.md)
- [createOnErrorHandler](functions/createOnErrorHandler.md)
- [Description](functions/Description.md)
- [ErrorBoundary](functions/ErrorBoundary.md)
- [faas](functions/faas.md)
- [FaasDataWrapper](functions/FaasDataWrapper.md)
- [FaasReactClient](functions/FaasReactClient.md)
- [Form](functions/Form.md)
- [FormItem](functions/FormItem.md)
- [idToTitle](functions/idToTitle.md)
- [Loading](functions/Loading.md)
- [renderDisplayValue](functions/renderDisplayValue.md)
- [Table](functions/Table.md)
- [Tabs](functions/Tabs.md)
- [Title](functions/Title.md)
- [transferOptions](functions/transferOptions.md)
- [transferValue](functions/transferValue.md)
- [useApp](functions/useApp.md)
- [useConfigContext](functions/useConfigContext.md)
- [useDrawer](functions/useDrawer.md)
- [useFaas](functions/useFaas.md)
- [useFaasStream](functions/useFaasStream.md)
- [useModal](functions/useModal.md)
- [useThemeToken](functions/useThemeToken.md)
- [withFaasData](functions/withFaasData.md)

## Interfaces

- [AppProps](interfaces/AppProps.md)
- [BaseItemProps](interfaces/BaseItemProps.md)
- [BlankProps](interfaces/BlankProps.md)
- [ConfigProviderProps](interfaces/ConfigProviderProps.md)
- [DescriptionCommonProps](interfaces/DescriptionCommonProps.md)
- [DescriptionItemContentProps](interfaces/DescriptionItemContentProps.md)
- [DescriptionItemProps](interfaces/DescriptionItemProps.md)
- [DescriptionWithFaasProps](interfaces/DescriptionWithFaasProps.md)
- [DescriptionWithoutFaasProps](interfaces/DescriptionWithoutFaasProps.md)
- [DrawerProps](interfaces/DrawerProps.md)
- [ErrorBoundaryProps](interfaces/ErrorBoundaryProps.md)
- [ExtendFormItemProps](interfaces/ExtendFormItemProps.md)
- [FaasDataWrapperProps](interfaces/FaasDataWrapperProps.md)
- [FaasItemProps](interfaces/FaasItemProps.md)
- [FormItemProps](interfaces/FormItemProps.md)
- [ModalProps](interfaces/ModalProps.md)
- [TableItemProps](interfaces/TableItemProps.md)
- [TabProps](interfaces/TabProps.md)
- [TabsProps](interfaces/TabsProps.md)
- [TitleProps](interfaces/TitleProps.md)
- [UnionFaasItemProps](interfaces/UnionFaasItemProps.md)

## Type Aliases

- [BaseExtendTypeProps](type-aliases/BaseExtendTypeProps.md)
- [BaseOption](type-aliases/BaseOption.md)
- [ConfigContextValue](type-aliases/ConfigContextValue.md)
- [DescriptionProps](type-aliases/DescriptionProps.md)
- [ExtendDescriptionItemProps](type-aliases/ExtendDescriptionItemProps.md)
- [ExtendDescriptionTypeProps](type-aliases/ExtendDescriptionTypeProps.md)
- [ExtendFormTypeProps](type-aliases/ExtendFormTypeProps.md)
- [ExtendTableItemProps](type-aliases/ExtendTableItemProps.md)
- [ExtendTableTypeProps](type-aliases/ExtendTableTypeProps.md)
- [ExtendTypes](type-aliases/ExtendTypes.md)
- [FaasDataInjection](type-aliases/FaasDataInjection.md)
- [FaasDataWrapperRef](type-aliases/FaasDataWrapperRef.md)
- [FaasItemType](type-aliases/FaasItemType.md)
- [FaasItemTypeValue](type-aliases/FaasItemTypeValue.md)
- [FaasReactClientOptions](type-aliases/FaasReactClientOptions.md)
- [FormCommonProps](type-aliases/FormCommonProps.md)
- [FormFaasProps](type-aliases/FormFaasProps.md)
- [FormProps](type-aliases/FormProps.md)
- [FormSubmitProps](type-aliases/FormSubmitProps.md)
- [FormWithFaasProps](type-aliases/FormWithFaasProps.md)
- [FormWithoutFaasProps](type-aliases/FormWithoutFaasProps.md)
- [LoadingProps](type-aliases/LoadingProps.md)
- [ResolvedTheme](type-aliases/ResolvedTheme.md)
- [setDrawerProps](type-aliases/setDrawerProps.md)
- [setModalProps](type-aliases/setModalProps.md)
- [TableFaasDataParams](type-aliases/TableFaasDataParams.md)
- [TableFaasDataResponse](type-aliases/TableFaasDataResponse.md)
- [TableProps](type-aliases/TableProps.md)
- [UnionFaasItemElement](type-aliases/UnionFaasItemElement.md)
- [UnionFaasItemInjection](type-aliases/UnionFaasItemInjection.md)
- [UnionFaasItemRender](type-aliases/UnionFaasItemRender.md)
- [UnionScene](type-aliases/UnionScene.md)
- [useAppProps](type-aliases/useAppProps.md)
- [UseFaasOptions](type-aliases/UseFaasOptions.md)
- [UseFaasStreamOptions](type-aliases/UseFaasStreamOptions.md)
- [UseFaasStreamResult](type-aliases/UseFaasStreamResult.md)

## Variables

- [AppContext](variables/AppContext.md)
- [ConfigContext](variables/ConfigContext.md)
