[@faasjs/func](../README.md) / FaasPluginEventMap

# Interface: FaasPluginEventMap

Plugin event augmentation map.

Extend this interface in plugin packages to describe which event fields are
injected when the plugin is enabled through `faas.yaml`.

## Properties

### http

> **http**: `object`

#### body?

> `optional` **body**: `any`

#### headers?

> `optional` **headers**: `Record`\<`string`, `any`\>

#### httpMethod?

> `optional` **httpMethod**: `string`

#### params?

> `optional` **params**: `Record`\<`string`, `any`\>

#### path?

> `optional` **path**: `string`

#### queryString?

> `optional` **queryString**: `Record`\<`string`, `any`\>

#### raw?

> `optional` **raw**: `object`

##### raw.request?

> `optional` **request**: `unknown`

##### raw.response?

> `optional` **response**: `unknown`
