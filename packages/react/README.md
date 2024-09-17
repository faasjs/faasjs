# @faasjs/react

React plugin for FaasJS.

[![License: MIT](https://img.shields.io/npm/l/@faasjs/react.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/react/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/react.svg)](https://www.npmjs.com/package/@faasjs/react)

**If you use [SWR](https://swr.vercel.app) or [React Query / TanStack Query](https://tanstack.com/query), please use [`@faasjs/browser`](https://faasjs.com/doc/browser) directly.**

## Features

- Support [FaasJS Request Specifications](https://faasjs.com/guide/request-spec.html).
- Support global and per-request configurations.
- Support [React Server Actions](https://react.dev/reference/rsc/server-actions).
- Compatible with [why-did-you-render](https://github.com/welldone-software/why-did-you-render).
- Additional React functions:
  - Utils:
    - [equal](functions/equal.md): Compare two values for deep equality.
    - [useEqualMemoize](functions/useEqualMemoize.md): Memoize a value with deep equality.
    - [useEqualEffect](functions/useEqualEffect.md): Run an effect with deep equality.
    - [useConstant](functions/useConstant.md): Create a constant value with hooks.
    - [createSplittingContext](functions/createSplittingContext.md): Create a context for code splitting.
    - [OptionalWrapper](functions/OptionalWrapper.md): Render a component optionally.
    - [ErrorBoundary](classes/ErrorBoundary.md): Catch errors in the component tree.
  - Fetch Data:
    - [faas](functions/faas.md): Fetch data from FaasJS.
    - [useFaas](functions/useFaas.md): Fetch data from FaasJS with hooks.
    - [FaasDataWrapper](functions/FaasDataWrapper.md): Fetch data from FaasJS with a wrapper component.
    - [withFaasData](functions/withFaasData.md): Fetch data from FaasJS using a higher-order component (HOC).

## Install

```sh
npm install @faasjs/react
```

## Functions

- [createSplittingContext](functions/createSplittingContext.md)
- [equal](functions/equal.md)
- [faas](functions/faas.md)
- [FaasDataWrapper](functions/FaasDataWrapper.md)
- [FaasReactClient](functions/FaasReactClient.md)
- [getClient](functions/getClient.md)
- [OptionalWrapper](functions/OptionalWrapper.md)
- [useConstant](functions/useConstant.md)
- [useEqualEffect](functions/useEqualEffect.md)
- [useEqualMemoize](functions/useEqualMemoize.md)
- [useFaas](functions/useFaas.md)
- [withFaasData](functions/withFaasData.md)

## Classes

- [ErrorBoundary](classes/ErrorBoundary.md)
- [Response](classes/Response.md)
- [ResponseError](classes/ResponseError.md)

## Interfaces

- [ErrorBoundaryProps](interfaces/ErrorBoundaryProps.md)

## Type Aliases

- [ErrorChildrenProps](type-aliases/ErrorChildrenProps.md)
- [FaasAction](type-aliases/FaasAction.md)
- [FaasData](type-aliases/FaasData.md)
- [FaasDataInjection](type-aliases/FaasDataInjection.md)
- [FaasDataWrapperProps](type-aliases/FaasDataWrapperProps.md)
- [FaasParams](type-aliases/FaasParams.md)
- [FaasReactClientInstance](type-aliases/FaasReactClientInstance.md)
- [FaasReactClientOptions](type-aliases/FaasReactClientOptions.md)
- [OnError](type-aliases/OnError.md)
- [OptionalWrapperProps](type-aliases/OptionalWrapperProps.md)
- [Options](type-aliases/Options.md)
- [ResponseHeaders](type-aliases/ResponseHeaders.md)
- [useFaasOptions](type-aliases/useFaasOptions.md)
