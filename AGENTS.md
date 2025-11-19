# AGENTS.md

## Project Overview

This is the repository for FaasJS, an atomic application framework for TypeScript. FaasJS is designed to build applications using a FaaS (Function-as-a-Service) architecture, which promotes breaking down complex projects into smaller, manageable, and isolated functions.

The project is a monorepo, with individual packages located in the `packages/` directory. It uses `npm` workspaces to manage the packages.

The core packages are:
- `@faasjs/func`: Provides the core functionality for creating functions.
- `@faasjs/http`: Provides HTTP request and response handling.
- `@faasjs/cli`: Provides a command-line interface for creating, running, and deploying FaasJS applications.
- `@faasjs/knex`: Provides a plugin for using the Knex.js query builder.
- `@faasjs/redis`: Provides a plugin for using Redis.

## Building and Running

### Prerequisites
- Node.js >= 24.0.0
- npm >= 11.0.0

### Installation
```bash
npm install
```

### Building
The project uses `turbo` to build all the packages.
```bash
npm run build
```

### Testing
The project uses `vitest` for testing.
```bash
npm test
```

### Linting
The project uses `biome` for linting.
```bash
npm run lint
```

## Development Conventions

### Code Style
The project uses `biome` to enforce a consistent code style. It's recommended to set up your editor to format on save using `biome`.

### Commits
Commit messages should follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Testing
Tests are located in the `__tests__` directory of each package. New features should be accompanied by tests.

### Documentation
The documentation is located in the `docs/` directory and is built using `VuePress`. To build the documentation, run:
```bash
npm run build:docs
```
