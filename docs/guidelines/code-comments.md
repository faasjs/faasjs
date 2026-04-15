# Code Comments Guide

Use this guide when adding or reviewing JSDoc, helper comments, or short intent notes in FaasJS code.

## Use This Guide When

- adding a new exported API
- reviewing whether an existing export is documented well enough
- deciding whether a private helper needs a short explanatory comment
- preserving a workaround or ordering-sensitive implementation that could look unusual later
- removing stale comments that now repeat the code

## Default Workflow

1. Pick a clear name first so the code does not depend on comments for basic readability.
2. Add JSDoc to every exported declaration before finalizing the implementation.
3. Make exported JSDoc cover the feature overview, caller inputs, and at least one example.
4. Add short inline comments only when a private helper name or a non-standard branch still needs context.
5. Explain why the code exists or what constraint it preserves, not what each line literally does.
6. Delete or rewrite comments as soon as the code changes enough that the old text could drift.

## Rules

### 1. Every export needs JSDoc

- Every exported function, class, hook, React component, interface, type alias, and public variable MUST have a JSDoc block close to the declaration.
- Re-exports may reuse the original declaration's canonical JSDoc, but the original exported symbol still needs the doc block.
- Treat exported JSDoc as part of the public contract because it feeds generated API docs and downstream AI or tooling usage.

### 2. Export JSDoc must cover features, params, and examples

- Exported JSDoc MUST include a short overview that tells readers what feature, capability, or responsibility the symbol provides.
- If the feature overview cannot stay clear in one sentence, switch to a short Markdown list that breaks the feature into concrete points instead of forcing a dense paragraph.
- Callable exports MUST document their inputs with `@param`.
- If an export has no callable parameters, document the consumer-facing fields with `@property` or member JSDoc so the same input guidance is still available.
- Exported APIs MUST include at least one `@example` that shows the smallest realistic usage.
- Add `@returns`, `@throws`, `@default`, or `@template` whenever those details matter to a caller.

### 3. Comment internal helpers only when the name is not enough

- Prefer renaming vague helpers such as `run`, `handle`, or `format` before adding a comment.
- Add one short comment above a private helper when its name does not fully explain side effects, normalization rules, lifecycle timing, or cache behavior.
- Skip comments for straightforward control flow, data mapping, or TypeScript boilerplate.

### 4. Comment non-standard code by explaining why

- Add a short note when code intentionally deviates from the obvious implementation, preserves runtime ordering, works around platform or tooling limits, or guards against a subtle regression.
- Explain the constraint or reason, not the syntax.
- Remove the comment once the workaround or special case disappears.

### 5. Keep comments short and current

- Prefer one or two sentences.
- Avoid repeating types, variable names, or line-by-line behavior that TypeScript and the code already make obvious.
- Update or delete comments in the same change that alters the behavior they describe.

## Examples

Exported API example:

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

Internal and non-standard code examples:

```ts
// Normalize ids once so repeated lookups do not allocate on every render.
function buildIdIndex(records: RecordItem[]) {
  // ...
}

// Keep this synchronous registration order because later plugins read earlier defaults.
plugins.unshift(systemPlugin)
```

## Review Checklist

- every export has a JSDoc block
- exported JSDoc covers feature overview, caller inputs, and an example
- complex features use a short list when one sentence would be too dense
- private helpers only have comments when names are still not descriptive enough
- unusual branches explain why they exist
- comments stay short and match current behavior

## Read Next

- [JSDoc Authoring Specification](../specs/jsdoc-authoring.md)
