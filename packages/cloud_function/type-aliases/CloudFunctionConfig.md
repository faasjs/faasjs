[@faasjs/cloud_function](../README.md) / CloudFunctionConfig

# Type alias: CloudFunctionConfig

> **CloudFunctionConfig**: `Object`

云函数配置项

## Index signature

 \[`key`: `string`\]: `any`

## Type declaration

### config?

> **config**?: `Object`

配置项

#### Index signature

 \[`key`: `string`\]: `any`

### config.memorySize?

> **config.memorySize**?: `64` \| `128` \| `256` \| `384` \| `512` \| `640` \| `768` \| `896` \| `1024` \| `number`

内存大小，单位为MB，默认 64

### config.name?

> **config.name**?: `string`

配置名称

### config.provisionedConcurrent?

> **config.provisionedConcurrent**?: `Object`

预制并发配置

### config.provisionedConcurrent.executions

> **config.provisionedConcurrent.executions**: `number`

预制并发数量

### config.timeout?

> **config.timeout**?: `number`

执行超时时间，单位为秒，默认 30

### config.triggers?

> **config.triggers**?: `Object`[]

触发器配置

### name?

> **name**?: `string`

插件名称

### validator?

> **validator**?: `Object`

### validator.event?

> **validator.event**?: `ValidatorConfig`
