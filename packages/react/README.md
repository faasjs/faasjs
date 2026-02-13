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
    - `equal`: Compare two values for deep equality.
    - `createSplittingContext`: Create a context for code splitting.
    - `useSplittingState`: Create splitting states.
  - Hooks:
    - `useEqualMemoize`: Memoize a value with deep equality.
    - `useEqualEffect`: Run an effect with deep equality.
    - `useEqualMemo`: Memoize a value with deep equality.
    - `useEqualCallback`: Memoize a callback with deep equality.
    - `useConstant`: Create a constant value with hooks.
    - `usePrevious`: Get the previous value of a state.
    - `useStateRef`: Create a state with a ref.
  - Components:
    - `OptionalWrapper`: Render a component optionally.
    - `ErrorBoundary`: Catch errors in the component tree.
  - Fetch Data:
    - `faas`: Fetch data from FaasJS.
    - `useFaas`: Fetch data from FaasJS with hooks.
    - `useFaasStream`: Fetch streaming data from FaasJS with hooks.
    - `FaasDataWrapper`: Fetch data from FaasJS with a wrapper component.
    - `withFaasData`: Fetch data from FaasJS using a higher-order component (HOC).

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
- [FormInput](functions/FormInput.md)
- [FormItem](functions/FormItem.md)
- [getClient](functions/getClient.md)
- [OptionalWrapper](functions/OptionalWrapper.md)
- [useConstant](functions/useConstant.md)
- [useEqualCallback](functions/useEqualCallback.md)
- [useEqualEffect](functions/useEqualEffect.md)
- [useEqualMemo](functions/useEqualMemo.md)
- [useEqualMemoize](functions/useEqualMemoize.md)
- [useFaas](functions/useFaas.md)
- [useFaasStream](functions/useFaasStream.md)
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

## Type Aliases

- [ErrorChildrenProps](type-aliases/ErrorChildrenProps.md)
- [FaasAction](type-aliases/FaasAction.md)
- [FaasActionUnionType](type-aliases/FaasActionUnionType.md)
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
- [FormInputProps](type-aliases/FormInputProps.md)
- [FormItemName](type-aliases/FormItemName.md)
- [FormItemProps](type-aliases/FormItemProps.md)
- [FormLabelElementProps](type-aliases/FormLabelElementProps.md)
- [FormLang](type-aliases/FormLang.md)
- [FormProps](type-aliases/FormProps.md)
- [FormRule](type-aliases/FormRule.md)
- [FormRules](type-aliases/FormRules.md)
- [InferFormInputProps](type-aliases/InferFormInputProps.md)
- [InferFormRulesOptions](type-aliases/InferFormRulesOptions.md)
- [InferRuleOption](type-aliases/InferRuleOption.md)
- [OnError](type-aliases/OnError.md)
- [OptionalWrapperProps](type-aliases/OptionalWrapperProps.md)
- [Options](type-aliases/Options.md)
- [ResponseHeaders](type-aliases/ResponseHeaders.md)
- [StateSetters](type-aliases/StateSetters.md)
- [StatesWithSetters](type-aliases/StatesWithSetters.md)
- [useFaasOptions](type-aliases/useFaasOptions.md)
- [UseFaasStreamOptions](type-aliases/UseFaasStreamOptions.md)
- [UseFaasStreamResult](type-aliases/UseFaasStreamResult.md)

## Variables

- [FaasDataWrapper](variables/FaasDataWrapper.md)
- [FormContextProvider](variables/FormContextProvider.md)
- [FormDefaultElements](variables/FormDefaultElements.md)
- [FormDefaultLang](variables/FormDefaultLang.md)
- [FormDefaultRules](variables/FormDefaultRules.md)
- [useFormContext](variables/useFormContext.md)
