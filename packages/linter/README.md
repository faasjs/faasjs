# @faasjs/linter

[![License: MIT](https://img.shields.io/npm/l/@faasjs/linter.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/linter/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/linter/stable.svg)](https://www.npmjs.com/package/@faasjs/linter)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/linter/beta.svg)](https://www.npmjs.com/package/@faasjs/linter)

[Biome](https://biomejs.dev/) rules.

## Install

    npm install @faasjs/linter --save-dev

Create `biome.json` to config the linter:

```json
{
	"$schema": "https://biomejs.dev/schemas/1.0.0/schema.json",
	"extends": ["./node_modules/@faasjs/linter/biome.json"]
}

```

## Usage

    npm exec biome check .
