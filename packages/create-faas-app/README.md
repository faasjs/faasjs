# create-faas-app

# create-faas-app

[![License: MIT](https://img.shields.io/npm/l/create-faas-app.svg)](https://github.com/faasjs/faasjs/blob/main/packages/create-faas-app/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/create-faas-app.svg)](https://www.npmjs.com/package/create-faas-app)

Curated scaffolder for FaasJS projects. The `admin` template is the default
React + Ant Design + PostgreSQL starter, and `minimal` provides a smaller
React starter. After scaffolding, the CLI runs `npm install`, `npm run types`,
and `npm run test` in the new project.

## Usage

```bash
npx create-faas-app --name faasjs
npx create-faas-app --name faasjs-admin --template admin
npx create-faas-app --name faasjs-minimal --template minimal
```

## Functions

- [main](functions/main.md)
