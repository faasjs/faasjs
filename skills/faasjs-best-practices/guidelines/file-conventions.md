# File Conventions

Use this guide when creating or reviewing frontend pages, React components, hooks, or FaasJS backend route files.

## Use This Guide When

- creating a new page, component, or hook
- reorganizing frontend folders
- adding page or feature folders under `pages/`
- creating or moving `.func.ts` backend files
- reviewing whether file names and locations stay predictable for humans and agents

## Default Workflow

1. Put frontend pages under `pages/`.
2. Use `index.tsx` for the main page entry when it keeps the folder easy to scan.
3. Keep one-off page-local logic inline until extraction is justified.
4. When a component or hook earns its own abstraction, give it its own file.
5. Group frontend code by page or feature.
6. Place components in `components/`, hooks in `hooks/`, and backend handlers in `api/`.
7. Place backend route files according to the routing-mapping specification.

## Rules

### 1. Extract components only when they earn a boundary

- Do not split JSX into a new component just to satisfy folder structure.
- Keep one-off page-local UI inline when extraction does not improve readability or reuse.
- When a React component is extracted, it SHOULD live in its own file.
- The file name SHOULD exactly match the component name.
- Preserve the component's case in the file name.
- Page files are the exception: page entry files SHOULD use `index.tsx` or `default.tsx`.

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

### 3. Organize frontend files by page or feature

- Frontend pages SHOULD be placed under `pages/`.
- Each page or feature SHOULD use its own directory under `pages/`.
- Main page entry files SHOULD use `index.tsx` when the folder maps cleanly to one feature page.
- Page entry files SHOULD `export default` the page component.
- Frontend routing SHOULD be defined explicitly in app code or the chosen UI framework.
- A directory named `api/` is reserved for backend handlers.
- Components MUST be placed under `components/`.
- Hooks MUST be placed under `hooks/`.
- Backend handlers for that page or feature SHOULD be placed under `api/` when they are feature-local.
- Only page entry files MAY be placed directly in the outer page or feature directory.
- Shared code that belongs to the same page or feature SHOULD stay inside that page or feature scope instead of being flattened at the root.
- If a page or feature file grows too large to scan comfortably, split it at a real component, hook, or API boundary instead of creating placeholder helper files.

Prefer this:

```text
src/pages/
  index.tsx
  docs/
    index.tsx
  feature-name/
    index.tsx
    components/
      FeatureNameHeader.tsx
      FeatureNameTable.tsx
    hooks/
      useFeatureNameData.ts
      useFeatureNameFilters.ts
    api/
      list.func.ts
```

Avoid this:

```text
src/pages/
  feature-name/
    FeatureNamePage.tsx
    FeatureNameHeader.tsx
    FeatureNameTable.tsx
    useFeatureNameData.ts
    useFeatureNameFilters.ts
```

Page entry example:

```tsx
export default function FeatureNamePage() {
  return <h1>Feature Name</h1>
}
```

Page layout example:

```text
src/pages/index.tsx
src/pages/feature-name/index.tsx
src/pages/docs/index.tsx
```

Frontend page organization under `src/pages` is a project convention, not an implicit FaasJS router. Define browser routes explicitly in your app or UI framework. Backend API routing is separate and still follows Zero-Mapping from the full path under `src/`.

### 4. Follow routing-mapping for backend files

- Backend route files MUST follow the routing-mapping specification.
- API entry files MUST end with `.func.ts`.
- API files SHOULD be placed under the page or feature's `api/` directory.
- Route paths and file paths MUST keep direct Zero-Mapping alignment.
- Use `index.func.ts` and `default.func.ts` only for the meanings defined by the spec.

Prefer this:

```text
src/pages/feature-name/api/list.func.ts
src/pages/feature-name/api/index.func.ts
src/pages/feature-name/api/default.func.ts
```

This maps directly to:

- `/pages/feature-name/api/list`
- `/pages/feature-name/api`
- `/pages/feature-name/api/*` fallback

### 5. Keep imports readable

- Read `tsconfig.json` and any config it extends before choosing import paths.
- Prefer aliases already defined in TypeScript config over deep relative imports when the path would otherwise cross several directories.
- Prefer short relative imports for nearby siblings such as `./UserCard` or `../hooks/useUser`.
- Do not introduce a new alias style unless the project already configures it, or you are updating project config in the same change.

## Review Checklist

- one-off UI or state logic is not extracted without a readability or reuse reason
- extracted components have their own file
- extracted hooks have their own file
- component file names match component names
- hook file names match hook names
- main page entry files use `index.tsx` when that keeps the folder easy to scan
- page entry files default-export the page component
- frontend pages live under `pages/`
- frontend components live in `components/`
- frontend hooks live in `hooks/`
- frontend backend handlers live in `api/`
- only page entry files stay at the outer page or feature level
- backend `.func.ts` files follow routing-mapping
- imports follow aliases already defined in `tsconfig.json` when available
- nearby imports stay relative instead of forcing alias usage everywhere

## Read Next

- [Routing Mapping Specification](../references/specs/routing-mapping.md)
- [defineApi Guide](./define-api.md)
