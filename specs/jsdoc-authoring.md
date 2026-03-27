# JSDoc Authoring Specification

Chinese: [JSDoc 编写规范](./jsdoc-authoring.zh.md)

## Metadata

- Status: Draft
- Version: v0.2
- Owner: FaasJS Maintainers
- Applies To: `packages/*/src` public exports and generated API Markdown under `packages/*/{classes,functions,interfaces,type-aliases,variables}`
- Last Updated: 2026-03-28

## Background

FaasJS already documents public APIs primarily through JSDoc in TypeScript source. [`build-docs.ts`](../build-docs.ts) runs TypeDoc against each package entry and emits Markdown under `classes/`, `functions/`, `interfaces/`, `type-aliases/`, and `variables/`.

Current package docs show stable patterns:

- package overviews in `src/index.ts`
- symbol summaries close to exported declarations
- tags such as `@param`, `@returns`, `@example`, `@throws`, `@default`, `@property`, `@template`, `@see`, and `{@link}`

The repository also contains style drift in tag syntax, language, and duplication. This spec defines the authoring baseline for new and touched public API docs.

## Goals

- Make public API docs predictable across packages and easy to generate with TypeDoc.
- Keep documentation close to source and aligned with actual TypeScript behavior.
- Make examples copy-pasteable for users and AI coding agents.

## Non-goals

- Replacing README or tutorial-style documentation.
- Documenting private helpers or test-only code.
- Standardizing prose outside source JSDoc and generated API Markdown.

## Normative Rules

### 1. Source of Truth and Scope

1. Public API documentation MUST be authored in JSDoc adjacent to the exported declaration in `packages/*/src`.
2. Generated Markdown under `packages/*/{classes,functions,interfaces,type-aliases,variables}` MUST be treated as derived output and MUST NOT be hand-edited.
3. Every exported class, function, hook, React component, interface, type alias, and public variable SHOULD have a JSDoc block when it is intended for direct package consumption.
4. Re-exports MAY rely on the original symbol's JSDoc, but package entrypoints SHOULD still provide a package or module overview when the package is user-facing.
5. Each declaration MUST have a single canonical JSDoc block. Duplicate lead comments for the same declaration are not allowed.

### 2. Language and Prose

1. Public JSDoc MUST be written in English so generated API Markdown has one primary language.
2. The first sentence MUST summarize what the symbol is or does.
3. Additional paragraphs SHOULD explain behavior, constraints, lifecycle, or notable caveats instead of restating the TypeScript signature.
4. Text MUST describe observable behavior and contracts. It SHOULD NOT duplicate implementation details that are likely to drift.
5. When a doc block is updated, touched comments SHOULD be normalized to this spec even if nearby legacy comments still use an older style.

### 3. Symbol-Level Content

1. Functions, hooks, and methods SHOULD document inputs, return shape, side effects, and failure cases when those are not obvious from the type signature alone.
2. Classes and React components SHOULD have a top-level overview plus constructor or props usage details when they are part of the public surface.
3. Interfaces and object-shaped type aliases SHOULD describe their purpose and SHOULD document important members with member JSDoc or `@property`.
4. Conditional, inferred, template-literal, or otherwise non-obvious types SHOULD explain the mapping rule and SHOULD include an example when that improves comprehension.
5. Package-level module comments in `src/index.ts` SHOULD include install and usage guidance when the package is meant to be consumed directly.

### 4. Tag Conventions

1. `@param` SHOULD use `{Type} name - description` style in TypeScript source.
2. `@returns` SHOULD be used when the returned value, promise payload, or empty result is not already obvious from the summary.
3. `@example` SHOULD be provided for public APIs whose usage is non-trivial, especially classes, hooks, factories, configuration objects, and advanced types.
4. `@throws` MUST document user-observable exceptions or validation errors that callers are expected to handle.
5. `@default` SHOULD be used for options or props with meaningful runtime defaults.
6. `@property` SHOULD be used for object-shaped options, response props, or prop bags when inline member comments are not sufficient.
7. `@template`, `@see`, `@augments`, and `@deprecated` MAY be used when they add information that TypeScript syntax alone does not communicate.
8. `{@link Symbol}` SHOULD be preferred for references to other FaasJS API symbols. Standard Markdown links MAY be used for external documents and URLs.
9. When multiple block tags appear in the same JSDoc block, they SHOULD follow this canonical order: `@template`, `@param`, `@returns`, `@throws`, `@default`, `@property`, `@see`, `@augments`, `@deprecated`, `@example`. Public docs touched during normal work SHOULD move toward this ordering from `@template` through `@example`.
10. Tag descriptions MUST stay consistent with actual runtime behavior, default values, and error semantics.

### 5. Examples and References

1. Examples MUST use fenced code blocks with an appropriate info string such as `ts`, `tsx`, `sh`, or `json`.
2. Examples SHOULD be minimal, runnable in principle, and focused on one behavior at a time.
3. Examples SHOULD import from the package's public entrypoint unless a documented deep import is intentionally public.
4. Cross references SHOULD point to the nearest relevant symbol or external reference instead of repeating long prose in multiple places.
5. Package and class overviews MAY use short Markdown headings and bullet lists when that improves scanability in generated docs.

### 6. Generation and Maintenance

1. When exported API shapes or public JSDoc change, contributors MUST regenerate API Markdown with `vp run doc` or `npx vp run doc` when `vp` is unavailable.
2. Generated output SHOULD be reviewed to confirm that headings, parameter descriptions, examples, and links render as intended.
3. Legacy comments that use older tag ordering, mixed language, or duplicate type annotations MAY remain temporarily, but touched public docs SHOULD move toward this specification.
4. This spec governs source comments and generated API Markdown only. Docs site pages and other narrative docs MAY use a different structure.

## Examples

````ts
/**
 * Load a package and resolve its preferred default export.
 *
 * @template T - The expected module shape.
 * @param {string} name - The package name to load.
 * @param {string | string[]} defaultNames - Preferred export keys used to resolve default values.
 * @param {LoadPackageOptions} options - Optional runtime loader options.
 * @returns Loaded module or resolved default export.
 * @throws {Error} When runtime cannot be determined.
 * @example
 * ```ts
 * const handler = await loadPackage('pkg', ['default', 'handler'])
 * ```
 */
export async function loadPackage<T = unknown>(
  name: string,
  defaultNames: string | string[] = 'default',
  options: LoadPackageOptions = {},
): Promise<T> {
  // ...
}
````

```ts
/**
 * Configuration options for a request.
 *
 * @property {Record<string, string>} [headers] - Extra request headers.
 * @property {boolean} [stream] - When true, return the native fetch response.
 */
export type Options = RequestInit & {
  /** @default false */
  stream?: boolean
}
```

## Compatibility

- Current FaasJS packages already rely on JSDoc plus TypeDoc generation for public API Markdown.
- Older comments may use both `@param name {type}` and `@param name - description`; both can render today, but this spec prefers `{Type} name - description` in TypeScript source.
- Some legacy comments contain non-English descriptions. Touched public docs should migrate to English.

## Migration Checklist

- [ ] Public exported symbols have a single canonical JSDoc block.
- [ ] New or touched docs start with a one-sentence summary.
- [ ] Runtime defaults, errors, and non-obvious examples are documented.
- [ ] Multi-tag JSDoc blocks follow the canonical tag order from `@template` to `@example`.
- [ ] Cross-symbol references use `{@link ...}` where practical.
- [ ] `vp run doc` has been run after public API doc changes.
