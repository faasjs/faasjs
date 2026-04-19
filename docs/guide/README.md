# Best Practices

Use these guides and specifications as the current public guidance for building with FaasJS.

## Global Rules

- Read `tsconfig.json` and any extended TypeScript config before choosing import paths.
- Prefer FaasJS TypeScript loader support for direct Node execution, and keep local TypeScript imports extensionless instead of adding `.ts` or `.tsx` suffixes.
- Prefer aliases already defined in TypeScript config over deep relative imports.
- Keep short relative imports for nearby files in the same feature or directory.
- Do not invent a new alias in code unless the corresponding `tsconfig.json` and runtime resolver are configured in the same change.
- Keep changes minimal and task-scoped: no extra features, drive-by refactors, opportunistic cleanup, feature flags, compatibility shims, or speculative future-proofing.
- Keep code direct: validate at system boundaries such as user input and external APIs, fail fast on invalid internal data, and do not add silent fallbacks or impossible-case handling.
- Extract helpers, hooks, components, or abstractions only when they are reused, create a real boundary, or simplify a large block; keep one-off code inline unless the body is over about 20 lines.
- Document every exported declaration with JSDoc, and add other comments only when names or logic are not obvious; do not add comments, docstrings, or type annotations to untouched code.
- Delete confirmed-dead code directly instead of leaving compatibility tricks such as `_unused` renames, type re-exports, or `// removed` markers.
- Keep files under about 500 lines by splitting along real boundaries before they grow too large.

## Guidelines

- [Ant Design Guide](../guidelines/ant-design.md): Covers `@faasjs/ant-design` page structure, routing, CRUD composition, feature-local APIs, and UI feedback patterns.
- [File Conventions](../guidelines/file-conventions.md): Covers where to place pages, components, hooks, and `.func.ts` files, plus when separate files are worth creating.
- [Code Comments Guide](../guidelines/code-comments.md): Covers export JSDoc expectations, public JSDoc language/tag conventions, when internal helpers need brief comments, and how to explain non-standard code without narrating it line by line.
- [Node Utils Guide](../guidelines/node-utils.md): Covers Node-only helpers for env/config loading, function and plugin bootstrapping, module loading, and shared logging.
- [Project Config Guide](../guidelines/project-config.md): Covers how to keep `tsconfig.json`, `vite.config.ts`, and shared tooling config aligned with FaasJS defaults.
- [Testing Guide](../guidelines/testing.md): Covers shared testing principles such as choosing test level, keeping mock boundaries narrow, and avoiding unnecessary mocks.
- [React Guide](../guidelines/react.md): Covers React component and hook patterns in FaasJS, especially avoiding native `useEffect` and handling non-primitive dependencies safely.
- [React Data Fetching Guide](../guidelines/react-data-fetching.md): Covers when to use `useFaas`, `useFaasStream`, `faas`, or wrapper components, and how to handle loading, error, and retry states.
- [React Testing Guide](../guidelines/react-testing.md): Covers request-related React testing with `setMock`, shared cleanup, `jsdom`, and common request-flow scenarios on top of the shared Testing Guide.
- [defineApi Guide](../guidelines/define-api.md): Covers building `.func.ts` endpoints with `defineApi`, inline schemas, typed `params`, error handling, and validation expectations.
- [Logger Guide](../guidelines/logger.md): Covers when to reuse injected loggers versus creating `Logger` instances, how to choose log levels, and how to time slow operations.
- [Utils Guide](../guidelines/utils.md): Covers portable helpers from `@faasjs/utils` for deep merging and converting text or JSON to and from streams.

## Specs

- [faas.yaml Configuration Specification](../specs/faas-yaml.md)
- [HTTP Protocol Specification](../specs/http-protocol.md)
- [Plugin Specification](../specs/plugin.md)
- [Routing Mapping Specification](../specs/routing-mapping.md)

## Packages

- [@faasjs/ant-design](/doc/ant-design/)
- [@faasjs/core](/doc/core/)
- [create-faas-app](/doc/create-faas-app/)
- [@faasjs/dev](/doc/dev/)
- [@faasjs/node-utils](/doc/node-utils/)
- [@faasjs/pg](/doc/pg/)
- [@faasjs/pg-dev](/doc/pg-dev/)
- [@faasjs/react](/doc/react/)
- [@faasjs/types](/doc/types/)
- [@faasjs/utils](/doc/utils/)
