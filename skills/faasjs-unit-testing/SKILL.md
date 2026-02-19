---
name: faasjs-unit-testing
description: FaasJS unit testing playbook - use test() only, shared mocks setup, and coverage matrix.
---

Apply this skill when writing, refactoring, or reviewing unit tests in FaasJS projects.

## Core rules

- Use `test()` from `@faasjs/dev` as the default test entry.
- Keep test files in `__tests__/` and name them `*.test.ts`.
- Prefer precise assertions (`statusCode`, `data`, `error`, `headers`) over broad truthy checks.
- Extract repeated mock/setup logic into shared test helpers.

## Guides

See [Test-only workflow](./test-only.md) for:
- Standard `test(func)` usage patterns
- HTTP-style assertions via `JSONhandler`
- Non-HTTP assertions via `handler`

See [Shared testing kit](./shared-testing.md) for:
- Shared mock lifecycle for repeated module mocks
- Reusable caller helper to remove repeated request setup
- Recommended `shared/` directory layout

See [Test matrix](./test-matrix.md) for:
- Minimal behavior coverage checklist
- Incremental run strategy for fast feedback
