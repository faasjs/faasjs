# Validation

Use this guide when developing or maintaining the FaasJS framework in this monorepo.

## Environment

- Node `>=26.0.0`
- npm `>=11.0.0`
- `package-lock.json` is the canonical lockfile
- Use `vp` from `vite-plus`; if it is not on PATH locally, use `npx vp ...`

## Common Commands

- Install dependencies: `npm run install`
- Run tests: `npm run test`
- Run coverage suite: `npm run ci`
- Run lint, format, and static checks: `npm run lint`
- Build packages: `npm run pack`
- Regenerate and sync docs with `@faasjs/docgen`: `npm run doc`
- Build docs site: `cd docs && npm run install && npm run build`

## How To Choose Validation

- Prefer the smallest useful validation for the files you touched.
- For significant or cross-package changes, run broader checks before handoff.
- If exported APIs, JSDoc, best-practices guides, specs, or generated guide indexes changed, run `npm run doc`.
- If docs content or navigation changed, run `npm run doc` first, then build the docs site.
- If you intentionally skip a check, explain why in the PR or handoff.

## CI Baseline

CI currently runs the equivalent of:

```bash
npm run install
npm run pack
npm run lint
npm run ci
```

## Testing Notes

- Node tests are primarily `packages/**/*.test.ts`
- UI tests are primarily `packages/**/*.test.tsx`, and use `packages/**/*.ui.test.ts` when a UI test does not use TSX syntax
- Type tests use `packages/**/*.types.test.ts` and `packages/**/*.types.test.tsx`
- Templates also have local test scripts and are useful for targeted regression checks

## Related Guides

- For docs, generated docs, navigation, and changelog triage, also follow [`documentation-sync.md`](./documentation-sync.md).
