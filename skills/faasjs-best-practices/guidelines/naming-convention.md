# Naming Convention

Use this guide when naming identifiers — functions, variables, types, files, and directories.

See [File Conventions](./file-conventions.md) for file placement rules (where to put things). This guide covers what to name them.

---

## 1. Identifier Naming

| Category | Convention | Examples |
|----------|-----------|----------|
| Functions | `camelCase`, verb-first | `createClient`, `parseSchemaValue` |
| Classes | `PascalCase` | `QueryBuilder`, `FaasBrowserClient` |
| Types / Interfaces | `PascalCase` | `ServerOptions`, `DefineApiData` |
| Enums | `PascalCase` (name + members) | `JobStatus { Pending, Running }` |
| Constants | `PascalCase` | `ViteConfig`, `DefaultTimeout` |
| React components | `PascalCase` | `UserCard`, `ErrorBoundary` |
| React hooks | `camelCase`, `use` prefix | `useUser`, `useDebounce` |
| React component props | `PascalCase`, suffixed with `Props` | `FaasDataWrapperProps` |
| Type guard functions | `camelCase`, `is` prefix | `isOperator`, `isTemplateStringsArray` |
| Generic type params | Single uppercase or PascalCase | `T`, `TData`, `TResult` |

### 1.1 Abbreviation Rules

| Rule | Correct | Incorrect |
|------|---------|-----------|
| Abbreviations at word boundaries | `parseApiFilenameFromStack` | `parseAPIFilenameFromStack` |
| Common tech terms as words | `Http`, `Json`, `Url`, `Html`, `Id` | `HTTP`, `JSON`, `URL`, `HTML`, `ID` |
| `lifecycle` as one word | `lifecycleKey`, `LifecycleHook` | `lifeCycleKey`, `LifeCycleHook` |

### 1.2 Common Verb Prefixes

| Prefix | Usage |
|--------|-------|
| `define*` | Define API or Job: `defineApi`, `defineJob` |
| `create*` | Factory: `createClient`, `createSplittingContext` |
| `get*` / `set*` | Accessors: `getClient`, `setMock` |
| `parse*` / `format*` | Parsing / formatting: `parseSchemaValue`, `formatSchemaError` |
| `use*` | React hooks: `useFaas`, `useStateRef` |
| `is*` | Type guards / predicates: `isOperator`, `isTypegenInputFile` |
| `*Options` | Config types: `ServerOptions`, `EnqueueJobOptions` |
| `*Props` | React prop types: `FaasDataWrapperProps` |
| `*Data` / `*Inject` | defineApi data / injection types: `DefineApiData`, `DefineApiInject` |

---

## 2. File and Directory Naming

| Category | Convention | Examples |
|----------|-----------|----------|
| Source directories | `camelCase` | `loadPackage/`, `parseYaml/` |
| Source files | `kebab-case` | `query-builder.ts`, `http-error.ts` |
| Test files | `kebab-case` + `.test.ts` | `query-builder.test.ts` |
| Component files | PascalCase, matches component name | `UserCard.tsx` → `export function UserCard()` |
| Hook files | camelCase, matches hook name | `useUser.ts` → `export function useUser()` |
| Type definition files | `kebab-case` | `types.ts`, `server-types.ts` |

---

## 3. Review Checklist

- [ ] Functions start with a verb (camelCase)
- [ ] Types / interfaces / constants are PascalCase
- [ ] Directories use camelCase
- [ ] Files use kebab-case (component/hook files use their own name)
- [ ] Abbreviations follow the word rule: `Http`, `Json`, `Url`, `Id`
- [ ] `lifecycle` is one word, all lowercase

---

## Further Reading

- [File Conventions](./file-conventions.md) — file placement rules
- [Code Comments Guide](./code-comments.md) — when to rename vs comment
