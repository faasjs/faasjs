# Getting Started

## Quickstart

### Start with Command Line

```bash
# use npm
npx create-faas-app --name faasjs

# use bun
bunx create-faas-app --name faasjs
```

### Start with Codespace

[FaasJS Stater](https://github.com/faasjs/starter)

## File Structure

### faas.yaml

This is the configuration file for FaasJS, which records the configuration items of cloud service providers and plugins.

### *.func.ts

This is the cloud function file. In FaasJS, all cloud function files must end with `.func.ts`.

### *.test.ts

This is the unit test file. In FaasJS, all unit test files must end with `.test.ts`.
