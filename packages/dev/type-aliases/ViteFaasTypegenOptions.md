[@faasjs/dev](../README.md) / ViteFaasTypegenOptions

# Type Alias: ViteFaasTypegenOptions

> **ViteFaasTypegenOptions** = `object`

## Properties

### debounce

> **debounce**: `number`

debounce time for file changes in ms, default is 120

### enabled

> **enabled**: `boolean`

enable or disable type generation, default is true

### output

> **output**: `string`

output declaration file path, default is <src>/.faasjs/types.d.ts

### src

> **src**: `string`

faas source directory, default is <root>/src

### staging

> **staging**: `string`

staging for faas.yaml, default is development

### watch

> **watch**: `boolean`

enable watch mode in vite dev server, default is true
