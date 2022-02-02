# @faasjs/browser

## Table of contents

### References

- [default](modules.md#default)

### Classes

- [FaasBrowserClient](classes/FaasBrowserClient.md)
- [Response](classes/Response.md)
- [ResponseError](classes/ResponseError.md)

### Type aliases

- [Options](modules.md#options)
- [ResponseHeaders](modules.md#responseheaders)

## References

### default

Renames and re-exports [FaasBrowserClient](classes/FaasBrowserClient.md)

## Type aliases

### Options

Ƭ **Options**: `RequestInit` & { `headers?`: { [key: string]: `string`;  } ; `beforeRequest?`: (`__namedParameters`: { `action`: `string` ; `options`: [`Options`](modules.md#options) ; `params`: `Record`<`string`, `any`\>  }) => `void` \| `Promise`<`void`\>  }

#### Defined in

[index.ts:5](https://github.com/faasjs/faasjs/blob/1705fd2/packages/browser/src/index.ts#L5)

___

### ResponseHeaders

Ƭ **ResponseHeaders**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[index.ts:18](https://github.com/faasjs/faasjs/blob/1705fd2/packages/browser/src/index.ts#L18)
