# @faasjs/react

React plugin for FaasJS.

[![License: MIT](https://img.shields.io/npm/l/@faasjs/react.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/react/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/react.svg)](https://www.npmjs.com/package/@faasjs/react)

**If you use [SWR](https://swr.vercel.app) or [React Query / TanStack Query](https://tanstack.com/query), please use [`@faasjs/browser`](https://faasjs.com/doc/browser) directly.**

## Install

```sh
npm install @faasjs/react
```

## Usage

1. Initialize [FaasReactClient](#faasreactclient)

```ts
import { FaasReactClient } from '@faasjs/react'

const client = FaasReactClient({
  domain: 'localhost:8080/api'
})
```

2. Use [faas](#faas), [useFaas](#usefaas) or [FaasDataWrapper](#faasdatawrapper).

## Usage with [@preact/signal-react](https://github.com/preactjs/signals/blob/main/packages/react/README.md)

1. `npm i --save-dev @preact/signals-react-transform`
2. Add `@preact/signals-react-transform` to babel config:
```json
{
	"plugins": [["module:@preact/signals-react-transform"]]
}
```
3. Add `import '@preact/signals-react/auto'` to your test files.

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
- [Options](type-aliases/Options.md)
- [ResponseHeaders](type-aliases/ResponseHeaders.md)
- [SignalOptions](type-aliases/SignalOptions.md)
- [useFaasOptions](type-aliases/useFaasOptions.md)

## Functions

- [FaasDataWrapper](functions/FaasDataWrapper.md)
- [FaasReactClient](functions/FaasReactClient.md)
- [faas](functions/faas.md)
- [getClient](functions/getClient.md)
- [signal](functions/signal.md)
- [useFaas](functions/useFaas.md)
- [useSignalState](functions/useSignalState.md)
