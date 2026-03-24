---
name: faasjs-best-practices
description: FaasJS best practices - file conventions, defineApi, testability, and unit testing.
---

Apply these rules when writing or reviewing FaasJS code.

## File conventions

See [File conventions](./file-conventions.md) for:

- Project structure and special files
- Route segments and fallback (`*.func.ts`, `index.func.ts`, `default.func.ts`)
- Verb naming semantics and list endpoint conventions

## defineApi

See [defineApi guide](./define-api.md) for:

- When to use `defineApi` in `*.func.ts` files
- How plugin config from `faas.yaml` is auto-loaded
- How request JSON body maps to typed `params`
- A complete endpoint example with typed params

## Testability and unit testing

Apply these rules while writing production code, not only when adding tests:

- Keep API handlers small and deterministic so `test(func)` can target one behavior at a time.
- Put tests in `__tests__/` and name them `*.test.ts`.
- Use `test()` from `@faasjs/dev` as the default test entry.
- Prefer explicit params, return values, and plugin side effects over hidden global state.
- Extract repeated mocks and request setup into shared helpers once they appear in multiple test files.

See [Test-only workflow](./test-only.md) for:

- Standard `test(func)` usage patterns
- HTTP-style assertions via `JSONhandler`
- Non-HTTP assertions via `handler`

See [Test matrix](./test-matrix.md) for:

- Minimal behavior coverage checklist
- Incremental run strategy for fast feedback
