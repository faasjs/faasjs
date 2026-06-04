# File Conventions

Use this guide when creating or reviewing feature folders, React components, hooks, FaasJS backend route files, background job files, or feature-owned CLI tools.

> **See also**: [Naming Convention Guide](./naming-convention.md) for identifier and file naming rules (camelCase, PascalCase, kebab-case, abbreviations, etc.). This guide covers _where_ files go; naming covers _what_ they are called.

## Applicable Scenarios

- Creating new features, feature UI, components, or hooks
- Refactoring application directory structure
- Adding a new feature directory under `features/`
- Creating or moving `.api.ts` backend files
- Creating or moving `.job.ts` background job files
- Creating or moving feature-owned CLI or tooling files
- Reviewing naming and placement decisions (see also [Naming Convention Guide](./naming-convention.md))

## Default Workflow

1. Put business feature code under `src/features/<feature>/`.
2. Use `index.tsx` for a feature's main React entry when the feature exposes UI.
3. Keep one-off feature-local logic inline until extraction is justified.
4. When a component or hook earns its own abstraction, give it its own file.
5. Group UI, APIs, jobs, CLI tools, schemas, and tests by feature.
6. Place components in `components/`, hooks in `hooks/`, backend route handlers in `api/`, background jobs in `jobs/`, and CLI tools in `cli/` inside the owning feature.
7. Place backend route files according to the routing-mapping specification and job files according to the jobs guide.

## Rules

### 1. Extract components only when they earn a boundary

- Do not split JSX into a new component just to satisfy folder structure.
- Keep one-off page-local UI inline when extraction does not improve readability or reuse.
- When a React component is extracted, it SHOULD live in its own file.
- The file name SHOULD exactly match the component name.
- Preserve the component's case in the file name.
- Feature UI entry files are the exception: use `index.tsx` or `default.tsx` when the file represents the feature entry.

Examples:

- `UserCard.tsx` -> `export function UserCard() {}`
- `OrderList.tsx` -> `export default function OrderList() {}`

### 2. Extract hooks only when they earn a boundary

- Do not create a `useXxx` wrapper for one-off logic that is still clearer inline.
- Extract a hook when the logic is reused, meaningfully simplifies the component, or deserves its own testable boundary.
- When a hook is extracted, it SHOULD live in its own file.
- The file name SHOULD exactly match the hook name.
- Hook files SHOULD keep the `useXxx` naming pattern.

Examples:

- `useUser.ts` -> `export function useUser() {}`
- `useOrderFilters.ts` -> `export function useOrderFilters() {}`

### 3. Organize files by feature

- Business features SHOULD be placed under `src/features/<feature>/`.
- Each feature SHOULD own its local UI, APIs, hooks, jobs, CLI tools, schemas, and tests.
- Feature UI entry files SHOULD use `index.tsx` when the folder maps cleanly to one feature surface.
- Feature UI entry files SHOULD `export default` the entry component.
- Frontend routing SHOULD be defined explicitly in app code or the chosen UI framework.
- A directory named `api/` is reserved for backend handlers.
- Components MUST be placed under `components/`.
- Hooks MUST be placed under `hooks/`.
- Backend handlers for that feature SHOULD be placed under the feature's `api/` directory.
- Feature-owned background jobs SHOULD be placed under the feature's `jobs/` directory.
- Feature-owned CLI tools SHOULD be placed under the feature's `cli/` directory.
- Only feature entry files MAY be placed directly in the outer feature directory.
- Shared code that belongs to the same feature SHOULD stay inside that feature scope instead of being flattened at the root.
- If a feature file grows too large to scan comfortably, split it at a real component, hook, API, job, CLI, or service boundary instead of creating placeholder helper files.

Prefer this:

```text
src/features/
  feature-name/
    index.tsx
    components/
      FeatureNameHeader.tsx
      FeatureNameTable.tsx
    hooks/
      useFeatureNameData.ts
      useFeatureNameFilters.ts
    api/
      list.api.ts
    jobs/
      sync.job.ts
    cli/
      import.ts
```

Avoid this:

```text
src/features/
  feature-name/
    FeatureNamePage.tsx
    FeatureNameHeader.tsx
    FeatureNameTable.tsx
    useFeatureNameData.ts
    useFeatureNameFilters.ts
```

Feature UI entry example:

```tsx
export default function FeatureNamePage() {
  return <h1>Feature Name</h1>
}
```

Feature layout example:

```text
src/features/feature-name/index.tsx
src/features/feature-name/components/FeatureNameTable.tsx
src/features/feature-name/api/list.api.ts
```

Feature organization under `src/features` is a project convention, not an implicit browser router. Define browser routes explicitly in your app or UI framework. Backend API routing is separate and still follows Zero-Mapping from the full path under `src/`.

### 4. Follow routing-mapping for backend files

- Backend route files MUST follow the [routing-mapping specification](./routing-mapping.md).
- API entry files MUST end with `.api.ts`.
- API files SHOULD be placed under the owning feature's `api/` directory.
- Route paths and file paths MUST keep direct Zero-Mapping alignment.
- Use `index.api.ts` and `default.api.ts` only for the meanings defined by the spec.

Prefer this:

```text
src/features/feature-name/api/list.api.ts
src/features/feature-name/api/index.api.ts
src/features/feature-name/api/default.api.ts
```

This maps directly to:

- `/features/feature-name/api/list`
- `/features/feature-name/api`
- `/features/feature-name/api/*` fallback

### 5. Place background jobs under feature `jobs/`

- Job entry files MUST end with `.job.ts`.
- Feature-owned job files SHOULD live under `src/features/<feature>/jobs/`.
- Cross-cutting or platform jobs MAY live under `src/jobs/`.
- Job files MUST default-export `defineJob(...)`.
- `index.job.ts` acts as the directory entry for a job path.
- Moving or renaming a `.job.ts` file changes the `enqueueJob()` path, just like moving a `.api.ts` file changes its route.

Prefer this:

```text
src/features/users/jobs/cleanup.job.ts
src/features/emails/jobs/send.job.ts
src/jobs/reports/index.job.ts
```

This maps directly to:

- `features/users/jobs/cleanup`
- `features/emails/jobs/send`
- `jobs/reports`

### 6. Keep imports readable

- Read `tsconfig.json` and any config it extends before choosing import paths.
- Prefer aliases already defined in TypeScript config over deep relative imports when the path would otherwise cross several directories.
- Prefer short relative imports for nearby siblings such as `./UserCard` or `../hooks/useUser`.
- Do not introduce a new alias style unless the project already configures it, or you are updating project config in the same change.

### 7. Follow naming conventions for shared code directories

- **`utils/`** for shared utility functions. Do not use `shared/`, `helpers/`, `common/`, or `lib/`. When `utils/` grows large, split by domain such as `utils/date/`, `utils/format/`.
- **`constants/`** for constant definitions. Do not use the singular `constant/`.

Prefer this:

```text
src/utils/date.ts
src/utils/format.ts
src/constants/index.ts
```

### 8. Keep all test-related files under `__tests__/`

- Test files, fixtures, mocks, stubs, and any other test support files MUST live inside `__tests__/`.
- Do not place `fixtures/`, `mocks/`, or other test support directories as siblings of `__tests__/`.

Prefer this:

```text
src/feature/__tests__/
  feature.test.ts
  fixtures/
    data.ts
```

Avoid this:

```text
src/feature/
  __tests__/
    feature.test.ts
  fixtures/           # ← sibling of __tests__
    data.ts
```

## Review Checklist

- one-off UI or state logic is not extracted without a readability or reuse reason
- extracted components have their own file
- extracted hooks have their own file
- component file names match component names
- hook file names match hook names
- main feature UI entry files use `index.tsx` when that keeps the folder easy to scan
- feature UI entry files default-export the entry component
- business feature code lives under `src/features/<feature>/`
- frontend components live in `components/`
- frontend hooks live in `hooks/`
- frontend backend handlers live in `api/`
- feature-owned background job files live in `jobs/` and end with `.job.ts`
- feature-owned CLI tools live in `cli/`
- only feature entry files stay at the outer feature level
- backend `.api.ts` files follow routing-mapping
- imports follow aliases already defined in `tsconfig.json` when available
- nearby imports stay relative instead of forcing alias usage everywhere
- shared utility code uses `utils/` instead of `shared/`, `helpers/`, `common/`, or `lib/`
- constant definitions use `constants/` instead of the singular `constant/`
- all test-related files (fixtures, mocks, stubs) live inside `__tests__/` rather than as sibling directories
