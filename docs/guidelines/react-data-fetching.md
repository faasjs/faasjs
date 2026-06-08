# React Data Fetching Guide

Use for FaasJS requests in React: `useFaas`, `useFaasStream`, `faas`, `FaasDataWrapper`, `withFaasData`, client setup, loading, error, retry, debounce, polling, and reload behavior.

## Applicable Scenarios

- Loading data into a component with request-response semantics
- Streaming text or chunked output into a component
- Choosing between `useFaas`, `useFaasStream`, `faas`, `FaasDataWrapper`, and `withFaasData`
- Configuring `FaasReactClient` with base URL and error handling
- Implementing loading, refreshing, error, and retry states
- Deciding when to use `skip`, `debounce`, `polling`, or `reload` before writing custom effects

## Default Workflow

1. Use `useFaas` for standard component-owned request state.
2. Use `useFaasStream` for streaming text or chunked output.
3. Use `faas` for imperative event-handler requests.
4. Use built-in `skip`, `debounce`, `polling`, and `reload(nextParams)` before custom effects or timers.
5. Use `FaasDataWrapper` or `withFaasData` only when wrapper composition helps.
6. Configure `FaasReactClient` once at app setup; use `getClient` only for multiple-client scenarios.
7. Always handle loading, error, and retry states in user-facing code.
8. Keep component props visible as `props.xxx`; avoid destructuring props in the component parameter list.

## Rules

### 1. Standard requests use `useFaas`

```tsx
import { useFaas } from '@faasjs/react'

export function Profile(props: { id: number }) {
  const { data, error, loading, reload } = useFaas('features/users/api/detail', { id: props.id })

  if (loading) return <div>Loading...</div>
  if (error)
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={reload}>Retry</button>
      </div>
    )

  return <div>Name: {data?.name}</div>
}
```

- Keep the request close to the component that renders or owns the data.
- Handle `loading`, `error`, and retry explicitly.
- Use `reload()` for same params and `reload(nextParams)` for user-triggered param changes.

### 2. Lifecycle controls beat custom effects

```tsx
import { useFaas } from '@faasjs/react'

export function UserSearch() {
  const [keyword, setKeyword] = React.useState('')

  const { data, error, loading, reload } = useFaas(
    'features/users/api/search',
    { keyword },
    {
      skip: (params) => !params.keyword.trim(),
      debounce: 300,
    },
  )

  return (
    <div>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search users"
      />
      {loading && <div>Searching...</div>}
      {error && <div>Error: {error.message}</div>}
      <button onClick={() => reload({ keyword: 'admin' })}>Load admins</button>
      <ul>
        {data?.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

- Use `skip` for missing params or user intent.
- Use `debounce` for search boxes and fast-changing filters.
- Use `polling` for dashboards, queues, and lists that should stay current.
- Use `reload(nextParams, { silent: true })` when refreshing should keep current content visible.
- Let FaasJS own abort, retry, polling, and reload state instead of rebuilding lifecycle plumbing.

### 3. Polling keeps old data visible

```tsx
import { useFaas } from '@faasjs/react'

export function PendingOrdersTable() {
  const { data, error, loading, refreshing } = useFaas(
    'features/orders/api/list',
    { status: 'pending' },
    {
      polling: 5000,
    },
  )

  if (loading && !data) return <div>Loading orders...</div>
  if (error) return <div>Failed to load: {error.message}</div>

  return (
    <div>
      {refreshing && <div>Refreshing...</div>}
      <table>
        {data?.items?.map((order: any) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.status}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}
```

- Treat `loading` as first-load or blocking reload state.
- Treat `refreshing` as non-blocking background refresh state.
- Stop polling with `skip` or `polling: false` when data is complete or params are missing.
- Do not wire `refreshing` to blocking table or page spinners.

### 4. Streaming uses `useFaasStream`

```tsx
import { useFaasStream } from '@faasjs/react'

export function Chat() {
  const { data, error, loading, reload } = useFaasStream('features/chat/api/stream', {
    prompt: 'hello',
  })

  if (loading) return <div>Connecting...</div>
  if (error) return <button onClick={reload}>Retry</button>

  return <pre>{data}</pre>
}
```

- Use for chat, logs, incremental text, and chunked payloads.
- Render partial `data` as it arrives.
- Still handle `loading`, `error`, and retry.

### 5. Imperative requests use `faas`

```tsx
import { useState } from 'react'
import { faas } from '@faasjs/react'

export function UserForm() {
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (values: any) => {
    setSaving(true)
    setSubmitError(null)
    try {
      await faas('features/users/api/create', values)
      // Close overlay, refresh list, show success
    } catch (error: any) {
      setSubmitError(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <button disabled={saving} onClick={() => handleSubmit({ name: 'test' })}>
        {saving ? 'Saving...' : 'Submit'}
      </button>
      {submitError && <div>Error: {submitError}</div>}
    </div>
  )
}
```

- Use in event handlers, confirmations, submit callbacks, or one-off commands.
- Pair mutations with user feedback and an intentional reload, close, or invalidate step.
- For form submissions, prefer the `Form` `faas` prop when available.

### 6. Wrappers are for composition boundaries

- Use `FaasDataWrapper` when wrapper composition simplifies an existing tree or render-prop boundary.
- Use `withFaasData` only when an HOC-style export is the clearest integration point.
- Do not use wrappers merely to avoid writing a small component with `useFaas`.

Wrapper with render prop:

```tsx
import { FaasDataWrapper } from '@faasjs/react'

export function UserSummary(props: { id: number }) {
  return (
    <FaasDataWrapper
      action="features/users/api/detail"
      params={{ id: props.id }}
      fallback={<div>Loading...</div>}
      render={(data) => <div>{data?.name}</div>}
    />
  )
}
```

Wrapper with children pattern:

```tsx
import { FaasDataWrapper } from '@faasjs/react'

function UserContent(props: { data: any }) {
  return <div>{props.data?.name}</div>
}

export function UserDetail(props: { id: number }) {
  return (
    <FaasDataWrapper action="features/users/api/detail" params={{ id: props.id }}>
      <UserContent />
    </FaasDataWrapper>
  )
}
```

### 7. HOC-style integration

```tsx
import { type FaasDataInjection, withFaasData } from '@faasjs/react'

type UserDetailProps = FaasDataInjection<'features/users/api/detail'> & {
  compact?: boolean
}

function UserDetail(props: UserDetailProps) {
  return <div>{props.data?.name}</div>
}

export default withFaasData<'features/users/api/detail', UserDetailProps>(UserDetail, {
  action: 'features/users/api/detail',
})
```

- Use `withFaasData` for legacy component boundaries or when the export shape requires an HOC.

### 8. Client setup stays centralized

```tsx
import { FaasReactClient } from '@faasjs/react'

FaasReactClient({
  baseUrl: '/api/',
  onError: (action, params) => async (error) => {
    console.error(`[${action}]`, error.message, params)
    // reportError(error, { action, params })
  },
})
```

- Configure the default client once near app bootstrap.
- Use `onError` for centralized error reporting (e.g. Sentry integration).
- Do not create clients inside render functions or feature components.

### 9. Multi-client scenario uses `getClient`

```tsx
import { FaasReactClient, getClient } from '@faasjs/react'

// Default client
FaasReactClient({ baseUrl: '/api/' })
// Secondary client
FaasReactClient({ baseUrl: 'https://other-service.com/' })

const otherClient = getClient('https://other-service.com/')
await otherClient.faas('external/endpoint', { key: 'value' })
```

- Use `getClient(host)` only for special multiple-client cases.
- Single-client apps should never need `getClient`.

## See Also

- [React Guide](./react.md) — component and hook patterns
- [Ant Design Guide](./ant-design.md) — `Form` `faas`, `Table` `faasData`, and `Description` `faasData` props
- [defineApi Guide](./define-api.md) — building the API endpoints that these hooks call
- [React Testing Guide](./react-testing.md) — testing request flows with `setMock`

## Review Checklist

- each request chooses the smallest fitting API: `useFaas`, `useFaasStream`, `faas`, wrapper, or HOC
- action paths follow file-conventions and use `/features/...` mapping
- loading, error, retry, and non-blocking refresh states are explicit
- built-in lifecycle options replace custom effects, intervals, and ad hoc debounce logic
- wrapper-style composition is used only when structurally beneficial
- mutations provide feedback and refresh, close, or invalidate affected data intentionally
- client setup is centralized; `getClient` is only for multiple-client scenarios
- `getClient` is not used in single-client apps
