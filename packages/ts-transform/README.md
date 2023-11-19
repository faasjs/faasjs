# @faasjs/ts-transform

[![License: MIT](https://img.shields.io/npm/l/@faasjs/ts-transform.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/ts-transform/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/ts-transform/stable.svg)](https://www.npmjs.com/package/@faasjs/ts-transform)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/ts-transform/beta.svg)](https://www.npmjs.com/package/@faasjs/ts-transform)

Typescript transform based on [SWC](https://swc.rs/).

## Install

    npm install @faasjs/ts-transform

## Usage

### Use as a register

```ts
import { addHook } from 'pirates'
import { transform } from '@faasjs/ts-transform'

addHook((code, filename) => {
  if (filename.endsWith('.d.ts'))
    return ''

  return transform(code, { filename }).code
}, {
  exts: [
    '.jsx',
    '.ts',
    '.tsx'
  ]
})
```

### Use as a rollup plugin

```ts
import { Plugin, rollup } from 'rollup'
import { bundle } from '@faasjs/ts-transform'

function tsTransform (): Plugin {
  return {
    name: 'tsTransform',
    async transform (code, filename) {
      return bundle({ filename })
    }
  }
}

export default {
  input: 'index.ts',
  output: {
    dir: 'dist',
    format: 'es',
  },
  plugins: [
    tsTransform(),
  ],
}
```

## Modules

### Variables

- [NodeBuiltinModules](#nodebuiltinmodules)

### Functions

- [bundle](#bundle)
- [transform](#transform)

## Variables

### NodeBuiltinModules

• `Const` **NodeBuiltinModules**: `string`[]

## Functions

### bundle

▸ **bundle**(`options`): `Promise`\<`Output`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.externalModules?` | `string`[] | has excluded node builtin modules |
| `options.filename` | `string` | - |
| `options.jscTarget?` | `JscTarget` | default: `es2019` |
| `options.root?` | `string` | default: process.cwd() |

#### Returns

`Promise`\<`Output`\>

___

### transform

▸ **transform**(`code`, `options?`): `Output`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | - |
| `options?` | `Object` | - |
| `options.filename?` | `string` | - |
| `options.jsc?` | `JscConfig` | swc compilation **`See`** https://swc.rs/docs/configuration/compilation |
| `options.root?` | `string` | default: process.cwd() |
| `options.target?` | `JscTarget` | default: `es2019` |

#### Returns

`Output`
