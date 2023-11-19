# Class: ResponseError

ResponseError class

## Hierarchy

- `Error`

  ↳ **`ResponseError`**

## Table of contents

### Constructors

- [constructor](ResponseError.md#constructor)

### Properties

- [body](ResponseError.md#body)
- [headers](ResponseError.md#headers)
- [request](ResponseError.md#request)
- [response](ResponseError.md#response)
- [statusCode](ResponseError.md#statuscode)
- [statusMessage](ResponseError.md#statusmessage)

## Constructors

### constructor

• **new ResponseError**(`message`, `response`): [`ResponseError`](ResponseError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `response` | [`Response`](../#response)\<`any`\> |

#### Returns

[`ResponseError`](ResponseError.md)

#### Overrides

Error.constructor

## Properties

### body

• **body**: `any`

___

### headers

• **headers**: `OutgoingHttpHeaders`

___

### request

• **request**: [`Request`](../#request)

___

### response

• **response**: [`Response`](../#response)\<`any`\>

___

### statusCode

• **statusCode**: `number`

___

### statusMessage

• **statusMessage**: `string`
