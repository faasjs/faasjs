# Code Comments Guide

Use for source JSDoc, helper comments, and short intent notes in FaasJS apps or packages. Docs pages and tutorials may use page-specific structure instead.

## Applicable Scenarios

- Adding a new package public export
- Reviewing whether an existing export's documentation is complete
- Deciding whether a private helper needs a comment
- Explaining order-sensitive or non-obvious code
- Cleaning up stale comments alongside code changes

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

### 1. Export surface

- Package public functions, classes, hooks, React components, interfaces, type aliases, and public variables MUST have adjacent JSDoc.
- Treat a package symbol as public when it is exported through a package public entrypoint or package export path. Internal helpers that use `export` only for same-package composition, tests, or file-local organization follow the shared-app or feature-local rules instead.
- Treat generated API docs as derived artifacts; always edit source comments rather than generated output.
- Shared app exports SHOULD have JSDoc when they form a reusable boundary or expose non-obvious caller expectations.
- Feature-local exports MAY omit JSDoc when they are only exported for local composition, routing, or tests and their contract is obvious.
- Re-exports may reuse the original declaration's canonical JSDoc, but the original public symbol still needs the doc block.
- Public package entrypoints SHOULD include a package or module overview when consumed directly.
- For directly-used packages, include install instructions in the module overview.

### 2. JSDoc content

- Start with a sentence describing what the symbol provides.
- Use a short list instead of a dense paragraph when enumerating fields or behaviors.
- Prefer caller-facing details: accepted inputs, returned output, defaults, observable side effects, and user-visible failure behavior.
- For non-callable exports with meaningful fields, use `@property` to document each field.
- Callable package public exports MUST document inputs with `@param`; add `@returns`, `@throws`, `@default`, or `@template` when useful to callers.
- Non-obvious conditional, inferred, template-literal, or marker type helpers SHOULD explain the mapping rule.
- Runtime public APIs SHOULD include a minimal `@example` when it clarifies caller behavior. For type-only or pure-shape exports, examples may be omitted when the overview and member docs are sufficient.
- For classes and components, add a top-level overview describing the component's role, its required context, and key rendering behavior.

### 3. Style and tags

- Prefer `@param {Type} name - description` style in TypeScript source.
- When multiple tags appear, prefer: `@template`, `@param`, `@returns`, `@throws`, `@default`, `@property`, `@see`, `@augments`, `@example`.
- Use `@see` and `@augments` only when the information cannot be expressed through TypeScript syntax alone.
- Use fenced examples with `ts`, `tsx`, `sh`, or `json`.
- Example imports SHOULD come from the package public entrypoint unless a deep import is intentionally public.
- Use `{@link Symbol}` for same-codebase public symbols and Markdown links for external docs.
- Keep descriptions consistent with real runtime behavior, defaults, and error semantics.

### 4. Separate caller contract from maintenance notes

- Write exported JSDoc for callers; write inline comments for maintainers.
- Contract information (`@param`, `@returns`, `@property`, defaults, failure semantics) belongs in the exported JSDoc block, not scattered through implementation details.
- Implementation-side comments should focus on reasoning, ordering, hidden constraints, and trade-offs.
- For low-level APIs not meant for direct consumption, note the preferred higher-level helper or entrypoint.

### 5. Write examples that show the symbol's role in a flow

- Each example should answer "where does this value come from?" or "what happens after calling this?"
- When a symbol depends on context (provider/consumer, hook/context, callback registration), prefer a minimal but complete end-to-end scenario.
- Keep examples minimal, theoretically runnable, and focused on one behavior at a time.
- For low-level APIs, show the surrounding setup and point to the more common entrypoint.
- Related exports under the same module should reuse the same business scenario when possible.
- Avoid placeholder examples like `const value = thing` or `{} as Type`.
- Examples can be short, but the result must be observable.

### 6. Prioritize boundary conditions, failure semantics, and hidden assumptions

- Prefer documenting `null`, `undefined`, empty collections, default values, and order-sensitive cases over happy-path behavior.
- Be explicit about failure behavior: throws, returns fallback, skips, retries, or silent no-op.
- Record assumptions that are not obvious from code: call within a specific provider, plugin must be registered first, environment-only availability.
- If behavior depends on timing or lifecycle, state the phase or order requirement directly.

### 7. Inline comments

- Private helpers need comments only when a good name still cannot explain the business rule, ordering constraint, or non-standard branch.
- Explain why the code exists, what invariant it protects, or what platform/tooling limit it handles.
- For performance notes, name the trigger and cost being avoided.
- Avoid repeating types, variable names, obvious control flow, or TypeScript boilerplate.
- When encountering names that are too generic (`run`, `handle`, `format`), prefer renaming over commenting.

### 8. Explain unusual, performance-sensitive, or platform-constrained code

- When code intentionally deviates from intuitive implementation, depends on runtime ordering, works around platform/tooling limits, or prevents subtle regressions, add a brief explanation.
- Performance-related comments should state the trigger condition and the cost being avoided, not just "for performance."
- Comments should explain the constraint or reasoning, not the syntax.

### 9. Regenerate derived docs from source

- After public contract changes, regenerate API docs from source JSDoc.
- Check that generated output renders correctly.
- Fixes should land in source JSDoc before regenerating.

### 10. Keep comments concise, stable, and continuously accurate

- Each comment should be 1-2 sentences.
- Do not repeat TypeScript types, variable names, or what the code already makes clear.
- Prefer stable information (purpose, constraints, contract) over volatile implementation details.
- Keep terminology consistent with public API naming.
- When modifying a public JSDoc block, bring it up to the conventions in this guide.
- When behavior changes, update or delete comments in the same change.

## Examples

Runtime API JSDoc with full tag ordering:

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

Generic function with template and throws:

````ts
/**
 * Load a package and return its default export.
 *
 * @template T - Expected module shape.
 * @param {string} name - Package name to load.
 * @returns Loaded default export.
 * @throws {Error} When runtime cannot be determined.
 * @see {@link loadConfig}
 * @example
 * ```ts
 * const handler = await loadPackage<MyHandler>('pkg')
 * ```
 */
export async function loadPackage<T = unknown>(name: string): Promise<T> {
  // ...
}
````

Low-level public API with usage guidance:

````ts
/**
 * Create a request-contextualized logger for a single invocation.
 *
 * Most business code should call `useLogger()` inside a handler.
 * Only call this directly when manually assembling a request context
 * during service startup.
 *
 * @param {LoggerTransport} transport - Shared transport created at app startup.
 * @param {RequestLike} request - Request metadata for the current call.
 * @returns Logger pre-filled with request id and pathname.
 * @see {@link useLogger}
 * @example
 * ```ts
 * const transport = createConsoleTransport()
 * const requestLogger = createRequestLogger(transport, {
 *   requestId: 'req_123',
 *   pathname: '/orders'
 * })
 * requestLogger.info('fetch order list')
 * ```
 */
export function createRequestLogger(transport: LoggerTransport, request: RequestLike) {
  // ...
}
````

Constraint comments:

```ts
// Normalize ids once so repeated lookups do not allocate on every render.
function buildIdIndex(records: RecordItem[]) {}

// Keep this synchronous registration order because later plugins read earlier defaults.
plugins.unshift(systemPlugin)
```

## Review Checklist

- package public exports have one canonical JSDoc block
- shared app exports are documented only when the caller contract is not obvious
- feature-local exports avoid noisy routine JSDoc
- public API documentation lives in source JSDoc; derived docs are synced from source
- public JSDoc uses one primary language per package with module overview at entrypoints
- classes, components, and non-obvious type helpers include context needed by callers
- JSDoc covers role, inputs, outputs, defaults, side effects, and failures when relevant
- examples explain the API's role in a flow and show concrete cause-and-effect
- low-level API examples provide enough context to understand the call chain
- boundary conditions, failure semantics, and hidden assumptions affecting correctness are documented
- performance and platform/tooling constraint comments explain what invariant they protect
- tag syntax, ordering, links, and examples follow conventions
- inline comments explain constraints or reasons, not syntax
- derived docs are regenerated from source comments after public contract changes
- comments are short, current, and not duplicated
