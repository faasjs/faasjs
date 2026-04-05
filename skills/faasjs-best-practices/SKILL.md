---
name: faasjs-best-practices
description: When working with FaasJS projects, must follow these best practices to ensure code quality, maintainability, and testability.
---

## Global Rules

- Read `tsconfig.json` and any extended TypeScript config before choosing import paths.
- Prefer aliases already defined in TypeScript config over deep relative imports.
- Keep short relative imports for nearby files in the same feature or directory.
- Do not invent a new alias in code unless the corresponding `tsconfig.json` and runtime resolver are configured in the same change.
- Do not create a new function unless the logic needs to be reused.

## Guidelines

- [Ant Design Guide](./guidelines/ant-design.md)
- [File Conventions](./guidelines/file-conventions.md)
- [Node Utils Guide](./guidelines/node-utils.md)
- [Project Config Guide](./guidelines/project-config.md)
- [React Guide](./guidelines/react.md)
- [React Data Fetching Guide](./guidelines/react-data-fetching.md)
- [React Testing Guide](./guidelines/react-testing.md)
- [defineApi Guide](./guidelines/define-api.md)
- [Logger Guide](./guidelines/logger.md)
- [Utils Guide](./guidelines/utils.md)

## Specs

- [faas.yaml Configuration Specification](./references/specs/faas-yaml.md)
- [HTTP Protocol Specification](./references/specs/http-protocol.md)
- [JSDoc Authoring Specification](./references/specs/jsdoc-authoring.md)
- [Plugin Specification](./references/specs/plugin.md)
- [Routing Mapping Specification](./references/specs/routing-mapping.md)

## Packages

- [@faasjs/ant-design](./references/packages/ant-design/README.md)
- [@faasjs/core](./references/packages/core/README.md)
- [create-faas-app](./references/packages/create-faas-app/README.md)
- [@faasjs/dev](./references/packages/dev/README.md)
- [@faasjs/node-utils](./references/packages/node-utils/README.md)
- [@faasjs/react](./references/packages/react/README.md)
- [@faasjs/types](./references/packages/types/README.md)
- [@faasjs/utils](./references/packages/utils/README.md)
