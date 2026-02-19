# Getting Started

## Prerequisites

FaasJS uses Node.js and npm managed by [mise](https://mise.jdx.dev/).

```bash
mise install
```

## Quick Start

### Start with Command Line

```bash
mise exec -- npx create-faas-app --name faasjs
```

### Start with Codespace

[FaasJS Starter](https://github.com/faasjs/starter)

## File Structure

### faas.yaml

This is the configuration file for FaasJS, which records cloud providers, plugins, and local development server (`server`) settings.

### \*.func.ts

This is the cloud function file. In FaasJS, all cloud function files must end with `.func.ts`.

### \*.test.ts

This is the unit test file. In FaasJS, all unit test files must end with `.test.ts`.
