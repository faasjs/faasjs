[@faasjs/cloud_function](../README.md) / CloudFunctionConfig

# Type Alias: CloudFunctionConfig

> **CloudFunctionConfig** = `object`

云函数配置项

## Indexable

\[`key`: `string`\]: `any`

## Properties

### config?

> `optional` **config**: `object`

配置项

#### Index Signature

\[`key`: `string`\]: `any`

#### memorySize?

> `optional` **memorySize**: `64` \| `128` \| `256` \| `384` \| `512` \| `640` \| `768` \| `896` \| `1024` \| `number`

内存大小，单位为MB，默认 64

#### name?

> `optional` **name**: `string`

配置名称

#### provisionedConcurrent?

> `optional` **provisionedConcurrent**: `object`

预制并发配置

##### provisionedConcurrent.executions

> **executions**: `number`

预制并发数量

#### timeout?

> `optional` **timeout**: `number`

执行超时时间，单位为秒，默认 30

#### triggers?

> `optional` **triggers**: `object`[]

触发器配置

### name?

> `optional` **name**: `string`

插件名称

### validator?

> `optional` **validator**: `object`

#### event?

> `optional` **event**: `ValidatorConfig`
