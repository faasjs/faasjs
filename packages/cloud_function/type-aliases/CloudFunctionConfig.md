[@faasjs/cloud_function](../README.md) / CloudFunctionConfig

# Type Alias: CloudFunctionConfig

> **CloudFunctionConfig**: `object`

云函数配置项

## Type declaration

## Index Signature

 \[`key`: `string`\]: `any`

### config?

> `optional` **config**: `object`

配置项

#### Index Signature

 \[`key`: `string`\]: `any`

#### config.memorySize?

> `optional` **memorySize**: `64` \| `128` \| `256` \| `384` \| `512` \| `640` \| `768` \| `896` \| `1024` \| `number`

内存大小，单位为MB，默认 64

#### config.name?

> `optional` **name**: `string`

配置名称

#### config.provisionedConcurrent?

> `optional` **provisionedConcurrent**: `object`

预制并发配置

#### config.provisionedConcurrent.executions

> **executions**: `number`

预制并发数量

#### config.timeout?

> `optional` **timeout**: `number`

执行超时时间，单位为秒，默认 30

#### config.triggers?

> `optional` **triggers**: `object`[]

触发器配置

### name?

> `optional` **name**: `string`

插件名称

### validator?

> `optional` **validator**: `object`

#### validator.event?

> `optional` **event**: `ValidatorConfig`
