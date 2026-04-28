# Code Comments Guide

Use for source JSDoc, helper comments, and short intent notes in FaasJS apps or packages. Docs pages and tutorials may use page-specific structure instead.

## Default Workflow

1. Pick clear names first; do not use comments to compensate for vague code.
2. Classify the export: package public API, shared app boundary, or feature-local implementation.
3. Document package public APIs with adjacent JSDoc and one canonical block per export.
4. Add shared app JSDoc only when caller contract, side effects, or failure behavior is not obvious from names and types.
5. Skip routine JSDoc for feature-local components, hooks, API default exports, and test helpers unless it prevents real ambiguity.
6. Keep public JSDoc in one primary language per package; prefer English for published or cross-team packages.
7. Add inline comments only for non-obvious private helpers, ordering constraints, or performance-sensitive branches.
8. Explain purpose, caller contract, or constraint; do not narrate syntax or line-by-line flow.
9. Regenerate derived API docs from source JSDoc after public contract changes.
10. Delete or rewrite stale comments in the same change that alters behavior.

## Rules

### Export surface

- Package public functions, classes, hooks, React components, interfaces, type aliases, and public variables MUST have adjacent JSDoc.
- Shared app exports SHOULD have JSDoc when they form a reusable boundary or expose non-obvious caller expectations.
- Feature-local exports MAY omit JSDoc when they are only exported for local composition, routing, or tests and their contract is obvious.
- Re-exports may reuse the original declaration's canonical JSDoc, but the original public symbol still needs the doc block.
- Public package entrypoints SHOULD include a package or module overview when consumed directly.

### JSDoc content

- Start with what the symbol provides; use a short list instead of a dense paragraph when needed.
- Prefer caller-facing details: accepted inputs, returned output, defaults, observable side effects, and user-visible failure behavior.
- Callable package public exports MUST document inputs with `@param`; add `@returns`, `@throws`, `@default`, or `@template` when useful to callers.
- Non-obvious conditional, inferred, template-literal, or marker type helpers SHOULD explain the mapping rule.
- Runtime public APIs SHOULD include a minimal `@example` when it clarifies caller behavior.
- Pure shape-only interfaces or type aliases MAY omit examples when overview and member docs are enough.

### Style and tags

- Prefer `@param {Type} name - description` style in TypeScript source.
- When multiple tags appear, prefer: `@template`, `@param`, `@returns`, `@throws`, `@default`, `@property`, `@see`, `@augments`, `@example`.
- Use fenced examples with `ts`, `tsx`, `sh`, or `json`.
- Example imports SHOULD come from the package public entrypoint unless a deep import is intentionally public.
- Use `{@link Symbol}` for same-codebase public symbols and Markdown links for external docs.
- Keep descriptions consistent with real runtime behavior, defaults, and error semantics.

### Inline comments

- Private helpers need comments only when a good name still cannot explain the business rule, ordering constraint, or non-standard branch.
- Explain why the code exists, what invariant it protects, or what platform/tooling limit it handles.
- For performance notes, name the trigger and cost being avoided.
- Avoid repeating types, variable names, obvious control flow, or TypeScript boilerplate.

## Examples

Runtime API JSDoc:

````ts
/**
 * Build a normalized route matcher for a FaasJS pathname.
 *
 * @param {string} pathname - Raw pathname from the incoming request.
 * @param {boolean} strict - When true, keep the trailing slash significant.
 * @returns Normalized matcher input for the router.
 * @example
 * ```ts
 * const matcher = createRouteMatcher('/users/', false)
 * ```
 */
export function createRouteMatcher(pathname: string, strict = false) {}
````

Constraint comments:

```ts
// Normalize ids once so repeated lookups do not allocate on every render.
function buildIdIndex(records: RecordItem[]) {}
```

## Review Checklist

- package public exports have one canonical JSDoc block
- shared app exports are documented only when the caller contract is not obvious
- feature-local exports avoid noisy routine JSDoc
- JSDoc covers role, inputs, outputs, defaults, side effects, and failures when relevant
- tag syntax, ordering, links, and examples follow conventions
- inline comments explain constraints or reasons, not syntax
- derived docs are regenerated from source comments after public contract changes
- comments are short, current, and not duplicated
