# @faasjs/react

React plugin for FaasJS.

[![License: MIT](https://img.shields.io/npm/l/@faasjs/react.svg)](https://github.com/faasjs/faasjs/blob/main/packages/react/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/react.svg)](https://www.npmjs.com/package/@faasjs/react)

**If you use [SWR](https://swr.vercel.app) or [React Query / TanStack Query](https://tanstack.com/query), please use [`@faasjs/browser`](https://faasjs.com/doc/browser) directly.**

## Features

- Support [FaasJS Request Specifications](https://faasjs.com/guide/request-spec.html).
- Support global and per-request configurations.
- Compatible with [why-did-you-render](https://github.com/welldone-software/why-did-you-render).
- Additional React functions:
  - Utils:
    - [equal](functions/equal.md): Compare two values for deep equality.
    - [createSplittingContext](functions/createSplittingContext.md): Create a context for code splitting.
    - [splittingState](functions/splittingState.md): Create a splitting states.
  - Hooks:
    - [useEqualMemoize](functions/useEqualMemoize.md): Memoize a value with deep equality.
    - [useEqualEffect](functions/useEqualEffect.md): Run an effect with deep equality.
    - [useEqualMemo](functions/useEqualMemo.md): Memoize a value with deep equality.
    - [useEqualCallback](functions/useEqualCallback.md): Memoize a callback with deep equality.
    - [useConstant](functions/useConstant.md): Create a constant value with hooks.
    - [usePrevious](functions/usePrevious.md): Get the previous value of a state.
    - [useStateRef](functions/useStateRef.md): Create a state with a ref.
  - Components:
    - [OptionalWrapper](functions/OptionalWrapper.md): Render a component optionally.
    - [ErrorBoundary](classes/ErrorBoundary.md): Catch errors in the component tree.
  - Fetch Data:
    - [faas](functions/faas.md): Fetch data from FaasJS.
    - [useFaas](functions/useFaas.md): Fetch data from FaasJS with hooks.
    - [FaasDataWrapper](functions/FaasDataWrapper.md): Fetch data from FaasJS with a wrapper component.
    - [withFaasData](functions/withFaasData.md): Fetch data from FaasJS using a higher-order component (HOC).

## Install

```sh
npm install @faasjs/react react
```

## Functions

- [createSplittingContext](functions/createSplittingContext.md)
- [equal](functions/equal.md)
- [faas](functions/faas.md)
- [FaasReactClient](functions/FaasReactClient.md)
- [Form](functions/Form.md)
- [FormItem](functions/FormItem.md)
- [getClient](functions/getClient.md)
- [useConstant](functions/useConstant.md)
- [useEqualCallback](functions/useEqualCallback.md)
- [useEqualEffect](functions/useEqualEffect.md)
- [useEqualMemo](functions/useEqualMemo.md)
- [useEqualMemoize](functions/useEqualMemoize.md)
- [useFaas](functions/useFaas.md)
- [usePrevious](functions/usePrevious.md)
- [useSplittingState](functions/useSplittingState.md)
- [useStateRef](functions/useStateRef.md)
- [validValues](functions/validValues.md)
- [withFaasData](functions/withFaasData.md)

## Classes

- [ErrorBoundary](classes/ErrorBoundary.md)

## Interfaces

- [ErrorBoundaryProps](interfaces/ErrorBoundaryProps.md)
- [Response](interfaces/Response.md)
- [ResponseError](interfaces/ResponseError.md)

## Namespaces

- [OptionalWrapper](@faasjs/namespaces/OptionalWrapper/README.md)

## Type Aliases

- [ErrorChildrenProps](type-aliases/ErrorChildrenProps.md)
- [FaasAction](type-aliases/FaasAction.md)
- [FaasData](type-aliases/FaasData.md)
- [FaasDataInjection](type-aliases/FaasDataInjection.md)
- [FaasDataWrapperProps](type-aliases/FaasDataWrapperProps.md)
- [FaasDataWrapperRef](type-aliases/FaasDataWrapperRef.md)
- [FaasParams](type-aliases/FaasParams.md)
- [FaasReactClientInstance](type-aliases/FaasReactClientInstance.md)
- [FaasReactClientOptions](type-aliases/FaasReactClientOptions.md)
- [FormButtonElementProps](type-aliases/FormButtonElementProps.md)
- [FormContextProps](type-aliases/FormContextProps.md)
- [FormDefaultRulesOptions](type-aliases/FormDefaultRulesOptions.md)
- [FormElementTypes](type-aliases/FormElementTypes.md)
- [FormInputElementProps](type-aliases/FormInputElementProps.md)
- [FormItemName](type-aliases/FormItemName.md)
- [FormItemProps](type-aliases/FormItemProps.md)
- [FormLabelElementProps](type-aliases/FormLabelElementProps.md)
- [FormLang](type-aliases/FormLang.md)
- [FormProps](type-aliases/FormProps.md)
- [FormRule](type-aliases/FormRule.md)
- [FormRules](type-aliases/FormRules.md)
- [InferFormRulesOptions](type-aliases/InferFormRulesOptions.md)
- [OnError](type-aliases/OnError.md)
- [OptionalWrapperProps](type-aliases/OptionalWrapperProps.md)
- [Options](type-aliases/Options.md)
- [ResponseHeaders](type-aliases/ResponseHeaders.md)
- [useFaasOptions](type-aliases/useFaasOptions.md)

## Variables

- [FaasDataWrapper](variables/FaasDataWrapper.md)
- [FormContextProvider](variables/FormContextProvider.md)
- [FormDefaultElements](variables/FormDefaultElements.md)
- [FormDefaultLang](variables/FormDefaultLang.md)
- [FormDefaultRules](variables/FormDefaultRules.md)
- [OptionalWrapper](variables/OptionalWrapper.md)
- [useFormContext](variables/useFormContext.md)
