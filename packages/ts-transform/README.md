# @faasjs/ts-transform

Typescript transform based on [SWC](https://swc.rs/)

[![License: MIT](https://img.shields.io/npm/l/@faasjs/ts-transform.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/ts-transform/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/ts-transform/stable.svg)](https://www.npmjs.com/package/@faasjs/ts-transform)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/ts-transform/beta.svg)](https://www.npmjs.com/package/@faasjs/ts-transform)

## Install

    npm i @faasjs/ts-transform

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
