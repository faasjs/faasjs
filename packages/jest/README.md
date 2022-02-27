# @faasjs/jest

[![License: MIT](https://img.shields.io/npm/l/@faasjs/jest.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/jest/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/jest/stable.svg)](https://www.npmjs.com/package/@faasjs/jest)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/jest/beta.svg)](https://www.npmjs.com/package/@faasjs/jest)

A jest plugin for faasjs projects.

## Install

    npm install -d @faasjs/jest

Add `jest` to your `package.json`:

```json
"jest": {
  "transform": {
    ".(jsx|tsx?)": "./packages/jest"
  },
  "testRegex": "/*\\.test\\.tsx?$",
  "coveragePathIgnorePatterns": [
    "/lib/",
    "/dist/",
    "/tmp/",
    "/__tests__/",
    "/examples/",
    "!*.d.ts"
  ],
  "moduleNameMapper": {
    "\\.(css|less|sass|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "@faasjs/jest"
  }
}
```
