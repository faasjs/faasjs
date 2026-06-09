# @faasjs/react

# React plugin for FaasJS.

[![License: MIT](https://img.shields.io/npm/l/@faasjs/react.svg)](https://github.com/faasjs/faasjs/blob/main/packages/react/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/react.svg)](https://www.npmjs.com/package/@faasjs/react)

Includes browser client utilities (`FaasBrowserClient`, `ResponseError`, `setMock`) and React helpers.

## Features

- Support [FaasJS Request Specifications](https://faasjs.com/guide/request-spec.html).
- Support global and per-request configurations.
- Additional React functions:
  - Utils:
    - `equal`: Compare two values for deep equality.
    - `createSplittingContext`: Create a context for code splitting.
    - `useStates`: Create splitting states.
    - `useStatesRef`: Create splitting states with refs.
  - Hooks:
    - `useEqualMemoize`: Memoize a value with deep equality.
    - `useEqualEffect`: Run an effect with deep equality.
    - `useEqualMemo`: Memoize a value with deep equality.
    - `useEqualCallback`: Memoize a callback with deep equality.
    - `useConstant`: Create a constant value with hooks.
    - `usePrevious`: Get the previous value of a state.
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
- [getClient](functions/getClient.md)
- [OptionalWrapper](functions/OptionalWrapper.md)
- [setMock](functions/setMock.md)
- [useConstant](functions/useConstant.md)
- [useEqualCallback](functions/useEqualCallback.md)
- [useEqualEffect](functions/useEqualEffect.md)
- [useEqualMemo](functions/useEqualMemo.md)
- [useEqualMemoize](functions/useEqualMemoize.md)
- [useFaas](functions/useFaas.md)
- [useFaasStream](functions/useFaasStream.md)
- [usePrevious](functions/usePrevious.md)
- [useStates](functions/useStates.md)
- [useStatesRef](functions/useStatesRef.md)
- [withFaasData](functions/withFaasData.md)

## Classes

- [ErrorBoundary](classes/ErrorBoundary.md)
- [FaasBrowserClient](classes/FaasBrowserClient.md)
- [Response](classes/Response.md)
- [ResponseError](classes/ResponseError.md)

## Interfaces

- [ErrorBoundaryProps](interfaces/ErrorBoundaryProps.md)

## Type Aliases

- [BaseUrl](type-aliases/BaseUrl.md)
- [ErrorChildrenProps](type-aliases/ErrorChildrenProps.md)
- [FaasBrowserClientAction](type-aliases/FaasBrowserClientAction.md)
- [FaasDataInjection](type-aliases/FaasDataInjection.md)
- [FaasDataWrapperProps](type-aliases/FaasDataWrapperProps.md)
- [FaasDataWrapperRef](type-aliases/FaasDataWrapperRef.md)
- [FaasReactClientInstance](type-aliases/FaasReactClientInstance.md)
- [FaasReactClientOptions](type-aliases/FaasReactClientOptions.md)
- [MockHandler](type-aliases/MockHandler.md)
- [OnError](type-aliases/OnError.md)
- [OptionalWrapperProps](type-aliases/OptionalWrapperProps.md)
- [Options](type-aliases/Options.md)
- [ResponseErrorProps](type-aliases/ResponseErrorProps.md)
- [ResponseHeaders](type-aliases/ResponseHeaders.md)
- [ResponseProps](type-aliases/ResponseProps.md)
- [StateRefs](type-aliases/StateRefs.md)
- [StateSetters](type-aliases/StateSetters.md)
- [StatesWithSetters](type-aliases/StatesWithSetters.md)
- [StatesWithSettersAndRefs](type-aliases/StatesWithSettersAndRefs.md)
- [UseFaasOptions](type-aliases/UseFaasOptions.md)
- [UseFaasStreamOptions](type-aliases/UseFaasStreamOptions.md)
- [UseFaasStreamResult](type-aliases/UseFaasStreamResult.md)

## Variables

- [FaasDataWrapper](variables/FaasDataWrapper.md)
