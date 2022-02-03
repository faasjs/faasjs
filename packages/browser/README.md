# @faasjs/browser

[![License: MIT](https://img.shields.io/npm/l/@faasjs/browser.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/browser/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/browser/stable.svg)](https://www.npmjs.com/package/@faasjs/browser)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/browser/beta.svg)](https://www.npmjs.com/package/@faasjs/browser)

Browser plugin for FaasJS.

## Install

    npm install @faasjs/browser

## Modules

### References

- [default](#default)

### Classes

- [FaasBrowserClient](classes/FaasBrowserClient.md)
- [Response](classes/Response.md)
- [ResponseError](classes/ResponseError.md)

### Type aliases

- [Options](#options)
- [ResponseHeaders](#responseheaders)

## References

### default

Renames and re-exports [FaasBrowserClient](classes/FaasBrowserClient.md)

## Type aliases

### Options

Ƭ **Options**: `RequestInit` & { `headers?`: { [key: string]: `string`;  } ; `beforeRequest?`: (`__namedParameters`: { `action`: `string` ; `options`: [`Options`](#options) ; `params`: `Record`<`string`, `any`\>  }) => `void` \| `Promise`<`void`\>  }

___

### ResponseHeaders

Ƭ **ResponseHeaders**: `Object`

#### Index signature

▪ [key: `string`]: `string`
