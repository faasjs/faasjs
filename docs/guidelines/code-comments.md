# Code Comments Guide

Use this guide when adding or reviewing JSDoc, helper comments, or short intent notes in a FaasJS app or package. For docs site pages or tutorials, use the structure that best fits the page instead of forcing source-JSDoc conventions.

## Use This Guide When

- adding a new exported API
- reviewing whether an existing export is documented well enough
- deciding whether a private helper needs a short explanatory comment
- preserving a workaround or ordering-sensitive implementation that could look unusual later
- removing stale comments that now repeat the code

## Default Workflow

1. Pick a clear name first so the code does not depend on comments for basic readability.
2. Author public API docs as adjacent JSDoc in the source file, and keep one canonical block per export.
3. Write public JSDoc in one primary language across the package. Prefer English for packages shared across teams or published publicly, and add at least one example for runtime-facing exports when it helps readers understand what changes for the caller.
4. Use stable tag syntax, tag ordering, and links so generated docs, IDE hovers, and review diffs stay predictable.
5. Separate caller-facing contract details from maintainer-facing implementation notes.
6. Add short inline comments only when a private helper name or a non-standard branch still needs context.
7. Explain why the code exists or what constraint it preserves, not what each line literally does.
8. If your project publishes derived API docs, regenerate them from the source JSDoc and review the rendered output after contract changes.
9. Delete or rewrite comments as soon as the code changes enough that the old text could drift.

## Rules

### 1. Public API docs live in source JSDoc

- Public API documentation SHOULD be authored as adjacent JSDoc close to the exported declaration.
- If your project generates reference pages from JSDoc, treat that output as derived and edit the source comments instead.
- Every exported function, class, hook, React component, interface, type alias, and public variable MUST have a JSDoc block close to the declaration.
- Re-exports may reuse the original declaration's canonical JSDoc, but the original exported symbol still needs the doc block.
- Each declaration SHOULD have one canonical JSDoc block. Do not stack duplicate lead comments for the same export.
- Public package entrypoints SHOULD provide a package or module overview, and they SHOULD add install or direct-usage guidance when the package is meant to be consumed directly.

### 2. Export JSDoc must explain the symbol's role and caller contract

- Public JSDoc SHOULD stay in one primary language within the same package. Prefer English when the code is shared across teams or published publicly.
- The first sentence or short opening list MUST tell readers what feature, capability, or responsibility the symbol provides.
- If the feature overview cannot stay clear in one sentence, switch to a short Markdown list or a short heading-plus-list structure instead of forcing a dense paragraph.
- Callable exports MUST document their inputs with `@param`.
- If an export has no callable parameters but does expose consumer-facing fields, document those fields with `@property` or member JSDoc so the same input guidance is still available.
- Exported JSDoc should prefer caller-facing contract details such as accepted inputs, returned outputs, defaults, observable side effects, and user-visible failure behavior.
- Classes and React components that are part of the public surface SHOULD include a top-level overview plus constructor or props usage details when those are not obvious from the type signature alone.
- Non-obvious conditional, inferred, template-literal, or similar type helpers SHOULD explain the mapping rule, and they SHOULD add an example when that materially improves comprehension.
- Exported runtime APIs SHOULD include at least one `@example` that shows the smallest realistic usage.
- Pure type exports such as shape-only interfaces or type aliases MAY omit `@example` when the overview plus any relevant `@property` or member JSDoc already make usage clear; for fieldless unions, primitives, template literal types, or marker aliases, the overview alone can be enough.
- Add `@returns`, `@throws`, `@default`, or `@template` whenever those details matter to a caller.

### 3. Use stable JSDoc tags and references

- `@param` SHOULD use `{Type} name - description` style in TypeScript source.
- When multiple block tags appear in the same JSDoc block, prefer this order: `@template`, `@param`, `@returns`, `@throws`, `@default`, `@property`, `@see`, `@augments`, `@deprecated`, `@example`.
- Examples MUST use fenced code blocks with an appropriate info string such as `ts`, `tsx`, `sh`, or `json`.
- Example imports SHOULD come from the package's public entrypoint unless a documented deep import is intentionally public.
- Use `{@link Symbol}` when pointing to another public API symbol in the same codebase, and use standard Markdown links for external docs or URLs.
- Use `@see`, `@augments`, and `@deprecated` when they add information that TypeScript syntax alone does not communicate.
- Tag descriptions MUST stay consistent with real runtime behavior, default values, and error semantics.

### 4. Separate caller contracts from maintainer notes

- Write exported JSDoc primarily for callers, and write inline or helper comments primarily for maintainers reading the implementation.
- Keep contract details such as `@param`, `@returns`, `@property`, defaults, and failure semantics in the exported JSDoc instead of scattering them across inline comments.
- Keep implementation notes focused on reasons, sequencing, hidden constraints, and tradeoffs that a caller does not need to know.
- For low-level APIs that are public but uncommon to call directly, say which higher-level helper or entrypoint most app code should use.

### 5. Write examples to make the symbol's role obvious

- Every `@example` should help readers answer "where does this value come from?" or "what changes when I use this API?".
- Prefer a tiny end-to-end scenario over a context-free one-liner when the symbol's role depends on surrounding setup, such as provider/consumer, hook/context, callback registration, or request/response flow.
- Examples SHOULD be minimal, runnable in principle, and focused on one behavior at a time.
- For low-level APIs, show the surrounding setup and name the higher-level helper you would usually prefer if direct usage is uncommon.
- Reuse one coherent scenario across related exports in the same module when that makes their relationship easier to understand.
- Avoid placeholder-only examples such as `const value = thing` or `{} as Type` when they do not teach the reader anything new.
- Keep examples small, but make the outcome observable through returned data, rendered text, or another concrete effect.

### 6. Document boundaries, failures, and hidden constraints

- Prefer documenting edge cases over restating the happy path, especially for `null`, `undefined`, empty collections, default behavior, and ordering-sensitive branches.
- Make failure semantics explicit when they matter: say whether the code throws, returns a fallback, skips work, retries, or silently no-ops.
- Call out hidden prerequisites that code alone may not make obvious, such as required providers, injected plugins, environment assumptions, or runtime-specific behavior.
- When behavior depends on timing or lifecycle, mention the phase or ordering requirement directly, such as mount before invoke, defaults before overrides, or registration order before reads.

### 7. Comment internal helpers only when the name is not enough

- Prefer renaming vague helpers such as `run`, `handle`, or `format` before adding a comment.
- Add one short comment above a private helper when its name does not fully explain side effects, normalization rules, lifecycle timing, or cache behavior.
- Skip comments for straightforward control flow, data mapping, or TypeScript boilerplate.

### 8. Comment non-standard, performance-sensitive, or compatibility code by explaining why

- Add a short note when code intentionally deviates from the obvious implementation, preserves runtime ordering, works around platform or tooling limits, or guards against a subtle regression.
- For performance-sensitive code, explain the trigger and cost you are avoiding, not just that the code is "faster".
- For compatibility notes, name the platform, library, tool, or generated-doc constraint that the code is working around.
- Explain the constraint or reason, not the syntax.
- Remove the comment once the workaround or special case disappears.

### 9. Keep derived docs synced from source comments

- When public API contracts or public JSDoc change, update any derived docs from the source comments instead of patching copied output.
- Review generated or published output to confirm that headings, parameter descriptions, examples, and links render as intended.
- Fix the source JSDoc first, then regenerate. Do not patch copied output directly.

### 10. Keep comments short, stable, and current

- Prefer each explanatory paragraph or inline note to stay within one or two sentences.
- Avoid repeating types, variable names, or line-by-line behavior that TypeScript and the code already make obvious.
- Prefer stable wording about purpose, constraints, and contracts over fragile wording that mirrors today's implementation details.
- Use the same project terms as the public API so generated docs and source comments do not drift into different vocabularies.
- When you touch a public JSDoc block, normalize it to these conventions even if nearby legacy comments still use older style.
- Write TODO or FIXME notes only when they include a clear reason and an exit condition or follow-up trigger.
- Update or delete comments in the same change that alters the behavior they describe.

## Examples

Exported runtime API example:

````ts
/**
 * Build a normalized route matcher for a FaasJS pathname.
 *
 * This keeps trailing-slash handling consistent across dev and production routing.
 *
 * @param {string} pathname - Raw pathname from the incoming request.
 * @param {boolean} strict - When true, keep the trailing slash significant.
 * @returns Normalized matcher input for the router.
 * @example
 * ```ts
 * const matcher = createRouteMatcher('/users/', false)
 * ```
 */
export function createRouteMatcher(pathname: string, strict = false) {
  // ...
}
````

Tag ordering and cross-reference example:

````ts
/**
 * Load a package and resolve its preferred default export.
 *
 * @template T - Expected module shape.
 * @param {string} name - Package name to load.
 * @param {string | string[]} defaultNames - Preferred export keys used to resolve default values.
 * @param {LoadPackageOptions} options - Optional runtime loader options.
 * @returns Loaded module or resolved default export.
 * @throws {Error} When runtime cannot be determined.
 * @see {@link loadConfig}
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

Low-level public API example:

````ts
/**
 * Create a request-scoped logger for one invocation.
 *
 * Most app code should call `useLogger()` inside a handler. Call this directly
 * only when you are wiring request context during server bootstrap.
 *
 * @param {LoggerTransport} transport - Shared transport created during app startup.
 * @param {RequestLike} request - Current request metadata for this invocation.
 * @returns Logger prefilled with request id and pathname.
 * @see {@link useLogger}
 * @example
 * ```ts
 * const transport = createConsoleTransport()
 * const requestLogger = createRequestLogger(transport, {
 *   requestId: 'req_123',
 *   pathname: '/orders'
 * })
 *
 * requestLogger.info('fetch order list')
 * ```
 */
export function createRequestLogger(transport: LoggerTransport, request: RequestLike) {
  // ...
}
````

Internal, performance, and compatibility examples:

```ts
// Normalize ids once so repeated lookups do not allocate on every render.
function buildIdIndex(records: RecordItem[]) {
  // ...
}

// Keep this branch for Node 18 stream adapters because they still deliver the
// close event before the final buffered chunk is flushed.
await drainLegacyStream(stream)

// Keep this synchronous registration order because later plugins read earlier defaults.
plugins.unshift(systemPlugin)
```

## Review Checklist

- public API docs live in source JSDoc, and any derived reference pages are refreshed from the source instead of hand-edited
- every export has one canonical JSDoc block
- public JSDoc stays in one primary language for the package, and package entrypoints have module overviews when needed
- exported JSDoc covers feature overview, caller inputs, and an example when the export is runtime-facing or the example adds real clarity
- classes, components, and non-obvious type helpers include the extra context callers need
- tag syntax, tag ordering, and cross references follow the shared conventions
- examples explain the API's role with a concrete cause/effect instead of only repeating the symbol name
- low-level APIs include enough surrounding setup in examples to make the flow understandable
- edge cases, failure semantics, and hidden prerequisites are documented when they affect correct usage
- performance and compatibility notes explain the specific constraint being preserved
- public JSDoc changes are reflected in any derived docs, and the rendered output is briefly reviewed
- private helpers only have comments when names are still not descriptive enough
- unusual branches explain why they exist
- TODO or FIXME notes include a reason and an exit condition
- comments stay short and match current behavior
