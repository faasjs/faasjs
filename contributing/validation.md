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
- Regenerate API docs: `vp run doc`
- Build docs site: `cd docs && vp install && vp run build`

## How To Choose Validation

- Prefer the smallest useful validation for the files you touched.
- For significant or cross-package changes, run broader checks before handoff.
- If exported APIs or JSDoc changed, run `vp run doc`.
- If docs content or navigation changed, build the docs site.
- If you intentionally skip a check, explain why in the PR or handoff.

## CI Baseline

CI currently runs the equivalent of:

```bash
vp install
vp pack
vp check
vp run ci
```

## Testing Notes

- Node tests are primarily `packages/**/*.test.ts` and `packages/**/*.test.tsx`
- Tests that require `jsdom` must use `packages/**/*.ui.test.ts` or `packages/**/*.ui.test.tsx`
- Type tests use `packages/**/*.types.test.ts` and `packages/**/*.types.test.tsx`
- Templates also have local test scripts and are useful for targeted regression checks

## Related Guides

- For docs, generated docs, translations, navigation, and changelog triage, also follow [`documentation-sync.md`](./documentation-sync.md).
