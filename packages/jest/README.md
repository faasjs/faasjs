# @faasjs/jest

[![License: MIT](https://img.shields.io/npm/l/@faasjs/jest.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/jest/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/jest.svg)](https://www.npmjs.com/package/@faasjs/jest)

A jest plugin for faasjs projects.

## Install

```sh
npm install -d @faasjs/jest
```

## Usage

Add `jest` to your `package.json`:

```json
"jest": {
  "transform": {
    ".(jsx|tsx?)": "@faasjs/jest"
  },
  "testRegex": "/*\\.test\\.tsx?$",
  "coveragePathIgnorePatterns": [
    "/lib/",
    "/dist/",
    "/tmp/",
    "/__tests__/",
    "!*.d.ts"
  ],
  "moduleNameMapper": {
    "\\.(css|less|sass|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "@faasjs/jest"
  }
}
```
