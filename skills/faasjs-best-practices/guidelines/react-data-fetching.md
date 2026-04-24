# React Data Fetching Guide

Use for FaasJS requests in React: `useFaas`, `useFaasStream`, `faas`, `FaasDataWrapper`, `withFaasData`, client setup, loading, error, retry, debounce, polling, and reload behavior.

## Default Workflow

1. Use `useFaas` for standard component-owned request state.
2. Use `useFaasStream` for streaming text or chunked output.
3. Use `faas` for imperative event-handler requests.
4. Use built-in `skip`, `debounce`, `polling`, and `reload(nextParams)` before custom effects or timers.
5. Use `FaasDataWrapper` or `withFaasData` only when wrapper composition helps.
6. Configure `FaasReactClient` once at app setup; use `getClient` only for multiple-client scenarios.
7. Always handle loading, error, and retry states in user-facing code.

## Rules

### 1. Standard requests use `useFaas`

```tsx
const { data, error, loading, reload } = useFaas('/pages/users/get', { id })
```

- Keep the request close to the component that renders or owns the data.
- Handle `loading`, `error`, and retry explicitly.
- Use `reload()` for same params and `reload(nextParams)` for user-triggered param changes.

### 2. Lifecycle controls beat custom effects

```tsx
const result = useFaas(
  '/pages/users/search',
  { keyword },
  {
    skip: (params) => !params.keyword.trim(),
    debounce: 300,
  },
)
```

- Use `skip` for missing params or user intent.
- Use `debounce` for search boxes and fast-changing filters.
- Use `polling` for dashboards, queues, and lists that should stay current.
- Use `reload(nextParams, { silent: true })` when refreshing should keep current content visible.
- Let FaasJS own abort, retry, polling, and reload state instead of rebuilding lifecycle plumbing.

### 3. Polling keeps old data visible

```tsx
const { data, loading, refreshing } = useFaas(
  '/pages/orders/list',
  { status },
  {
    polling: status === 'pending' ? 5000 : false,
  },
)
```

- Treat `loading` as first-load or blocking reload state.
- Treat `refreshing` as non-blocking background refresh state.
- Stop polling with `skip` or `polling: false` when data is complete or params are missing.
- Do not wire `refreshing` to blocking table or page spinners.

### 4. Streaming uses `useFaasStream`

```tsx
const { data, error, loading, reload } = useFaasStream('/pages/chat/stream', { prompt })
```

- Use for chat, logs, incremental text, and chunked payloads.
- Render partial `data` as it arrives.
- Still handle `loading`, `error`, and retry.

### 5. Imperative requests use `faas`

```tsx
await faas('/pages/users/remove', { id })
```

- Use in event handlers, confirmations, submit callbacks, or one-off commands.
- Pair mutations with user feedback and an intentional reload, close, or invalidate step.
- For form submissions, prefer `Form.faas` when available.

### 6. Wrappers are for composition boundaries

- Use `FaasDataWrapper` when wrapper composition simplifies an existing tree or render-prop boundary.
- Use `withFaasData` only when an HOC-style export is the clearest integration point.
- Do not use wrappers merely to avoid writing a small component with `useFaas`.

### 7. Client setup stays centralized

```tsx
FaasReactClient({ baseUrl: '/api' })
```

- Configure the default client once near app bootstrap.
- Do not create clients inside render functions or feature components.
- Use `getClient(host)` only for special multiple-client cases.

## Review Checklist

- each request chooses the smallest fitting API: `useFaas`, `useFaasStream`, `faas`, wrapper, or HOC
- loading, error, retry, and non-blocking refresh states are explicit
- built-in lifecycle options replace custom effects, intervals, and ad hoc debounce logic
- mutations provide feedback and refresh, close, or invalidate affected data intentionally
- client setup is centralized; `getClient` is only for multiple-client scenarios
