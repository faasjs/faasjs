# File Conventions

Use this guide when creating or reviewing frontend pages, React components, hooks, or FaasJS backend route files.

## Use This Guide When

- creating a new page, component, or hook
- reorganizing frontend folders
- wiring page routes with `Routes` and `lazy`
- creating or moving `.func.ts` backend files
- reviewing whether file names and locations stay predictable for humans and agents

## Default Workflow

1. Put frontend pages under `pages/`.
2. Use `index.tsx` as the page entry file.
3. Split each React component into its own file.
4. Split each hook into its own file.
5. Group frontend code by page or feature.
6. Place components in `components/`, hooks in `hooks/`, and backend handlers in `api/`.
7. Place backend route files according to the routing-mapping specification.

## Rules

### 1. One component per file

- A React component SHOULD live in its own file.
- The file name SHOULD exactly match the component name.
- Preserve the component's case in the file name.
- Page files are the exception: page entry files SHOULD use `index.tsx`.

Examples:

- `UserCard.tsx` -> `export function UserCard() {}`
- `OrderList.tsx` -> `export default function OrderList() {}`

### 2. One hook per file

- A hook SHOULD live in its own file.
- The file name SHOULD exactly match the hook name.
- Hook files SHOULD keep the `useXxx` naming pattern.

Examples:

- `useUser.ts` -> `export function useUser() {}`
- `useOrderFilters.ts` -> `export function useOrderFilters() {}`

### 3. Organize frontend files by page or feature

- Frontend pages SHOULD be placed under `pages/`.
- Each page or feature SHOULD use its own directory under `pages/`.
- The page entry file MUST be named `index.tsx`.
- The page entry file SHOULD `export default` the page component.
- Components MUST be placed under `components/`.
- Hooks MUST be placed under `hooks/`.
- Backend handlers for that page or feature SHOULD be placed under `api/`.
- Only the page entry file MAY be placed directly in the outer page or feature directory.
- Shared code that belongs to the same page or feature SHOULD stay inside that page or feature scope instead of being flattened at the root.

Prefer this:

```text
src/pages/
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
  index.tsx
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
  return null
}
```

Root routes example based on `@faasjs/ant-design` `Routes`:

```tsx
import { Routes, lazy } from '@faasjs/ant-design'

export default function Pages() {
  return (
    <Routes
      routes={[
        {
          path: 'feature-name',
          page: lazy(() => import('./feature-name')),
        },
      ]}
    />
  )
}
```

The frontend page route is defined by `Routes` config. Backend API routing is separate and still
follows Zero-Mapping from the full path under `src/`.

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

- each component has its own file
- each hook has its own file
- component file names match component names
- hook file names match hook names
- page entry files are named `index.tsx`
- page entry files default-export the page component
- frontend pages live under `pages/`
- frontend components live in `components/`
- frontend hooks live in `hooks/`
- frontend backend handlers live in `api/`
- only page entries stay at the outer page or feature level
- backend `.func.ts` files follow routing-mapping
- imports follow aliases already defined in `tsconfig.json` when available
- nearby imports stay relative instead of forcing alias usage everywhere

## Read Next

- [Routing Mapping Specification](../references/specs/routing-mapping.md)
- [defineApi Guide](./define-api.md)
