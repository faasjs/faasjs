# Validation

Use this guide when developing or maintaining the FaasJS framework in this monorepo.

## Environment

- Node `>=24.0.0`
- npm `>=11.0.0`
- `package-lock.json` is the canonical lockfile
- Use `vp` from `vite-plus`; if it is not on PATH locally, use `npx vp ...`

## Common Commands

- Install dependencies: `vp install`
- Run tests: `vp test`
- Run coverage suite: `vp run ci`
- Run lint, format, and static checks: `vp check`
- Build packages: `vp pack`
- Regenerate and sync docs with `@faasjs/docgen`: `vp run doc`
- Build docs site: `cd docs && vp install && vp run build`

## How To Choose Validation

- Prefer the smallest useful validation for the files you touched.
- For significant or cross-package changes, run broader checks before handoff.
- If exported APIs, JSDoc, best-practices guides, specs, translations, or generated guide indexes changed, run `vp run doc`.
- If docs content or navigation changed, run `vp run doc` first, then build the docs site.
- If you intentionally skip a check, explain why in the PR or handoff.

## CI Baseline

CI currently runs the equivalent of:

```bash
vp install
vp pack
vp check --fix
vp run ci
```

## Testing Notes

- Node tests are primarily `packages/**/*.test.ts`
- UI tests are primarily `packages/**/*.test.tsx`, and use `packages/**/*.ui.test.ts` when a UI test does not use TSX syntax
- Type tests use `packages/**/*.types.test.ts` and `packages/**/*.types.test.tsx`
- Templates also have local test scripts and are useful for targeted regression checks

## Related Guides

- For docs, generated docs, translations, navigation, and changelog triage, also follow [`documentation-sync.md`](./documentation-sync.md).
