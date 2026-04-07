# React Data Fetching Guide

Use this guide when creating or reviewing FaasJS data requests in React components.

## Use This Guide When

- fetching normal request-response data in React
- fetching streaming responses in React
- choosing between `useFaas`, `useFaasStream`, `faas`, `FaasDataWrapper`, and `withFaasData`
- configuring `FaasReactClient`
- handling request loading, error, and retry states

## Default Workflow

1. Use `useFaas` for standard component-level requests.
2. Use `useFaasStream` for streaming text or chunked output.
3. Use `faas` for imperative requests inside event handlers.
4. Reach for `FaasDataWrapper` or `withFaasData` only when composition benefits from them.
5. Configure `FaasReactClient` once at app setup.
6. Handle loading, error, and retry states explicitly.

## Rules

### 1. Use `useFaas` for standard requests

- `useFaas` is the default choice when a component needs `loading`, `data`, `error`, and `reload`.
- Keep the request close to the component that actually renders or owns the data.
- Always handle error and retry states explicitly in user-facing code.

Example:

```tsx
import { useFaas } from '@faasjs/react'

export function Profile({ id }: { id: number }) {
  const { data, error, loading, reload } = useFaas('/pages/users/get', { id })

  if (loading) return <div>Loading...</div>

  if (error) {
    return (
      <div>
        <div>Load failed: {error.message}</div>
        <button type="button" onClick={() => reload()}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <span>{data.name}</span>
      <button type="button" onClick={() => reload()}>
        Refresh
      </button>
    </div>
  )
}
```

### 2. Use `useFaasStream` for streaming responses

- Use `useFaasStream` for chat, logs, incremental text output, or other streaming payloads.
- Surface loading and error states explicitly.
- Keep the rendering logic simple so the streaming behavior stays easy to reason about.

Example:

```tsx
import { useFaasStream } from '@faasjs/react'

export function Chat({ prompt }: { prompt: string }) {
  const { data, error, loading, reload } = useFaasStream('/pages/chat/stream', { prompt })

  if (loading) return <div>Streaming...</div>

  if (error) {
    return (
      <div>
        <div>Stream failed: {error.message}</div>
        <button type="button" onClick={() => reload()}>
          Retry
        </button>
      </div>
    )
  }

  return <pre>{data}</pre>
}
```

### 3. Use `faas` for imperative requests

- Use `faas` in event handlers, submit handlers, or other imperative flows.
- Manage pending and failure state in the local component.
- Do not convert an event-driven submit flow into a hook just to make a request.

Example:

```tsx
import type { FormEvent } from 'react'
import { useState } from 'react'

import { faas } from '@faasjs/react'

export function UserForm({ id }: { id: number }) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string>()

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      setSaving(true)
      setSubmitError(undefined)

      await faas('/pages/users/set', {
        id,
        name,
      })
    } catch (error: any) {
      setSubmitError(error.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </button>
      {submitError ? <div>{submitError}</div> : null}
    </form>
  )
}
```

### 4. Use `FaasDataWrapper` only when wrapper composition helps

- Use `FaasDataWrapper` when render-prop or wrapper composition fits the page structure better than calling `useFaas` directly.
- When using `children`, `FaasDataWrapper` clones the child element and injects request props such as `data`, `error`, and `reload`.
- Prefer `useFaas` for new function components unless wrapper composition is meaningfully simpler.

`FaasDataWrapper` with `render` example:

```tsx
import { FaasDataWrapper } from '@faasjs/react'

export function UserPanelWithRender({ id }: { id: number }) {
  return (
    <FaasDataWrapper
      action="/pages/users/get"
      params={{ id }}
      fallback={<div>Loading...</div>}
      render={({ data, error, reload }) =>
        error ? (
          <div>
            <div>Load failed: {error.message}</div>
            <button type="button" onClick={() => reload()}>
              Retry
            </button>
          </div>
        ) : (
          <div>{data.name}</div>
        )
      }
    />
  )
}
```

`FaasDataWrapper` with `children` example:

```tsx
import { FaasDataWrapper } from '@faasjs/react'

function UserContent(props: {
  data?: { name: string }
  error?: { message?: string } | null
  reload?(): Promise<any>
}) {
  if (props.error) {
    return (
      <div>
        <div>Load failed: {props.error.message}</div>
        <button type="button" onClick={() => props.reload?.()}>
          Retry
        </button>
      </div>
    )
  }

  return <div>{props.data?.name}</div>
}

export function UserPanelWithChildren({ id }: { id: number }) {
  return (
    <FaasDataWrapper action="/pages/users/get" params={{ id }} fallback={<div>Loading...</div>}>
      <UserContent />
    </FaasDataWrapper>
  )
}
```

### 5. Use `withFaasData` only for wrapper-style exports or fixed integration boundaries

- Use `withFaasData` only when an HOC is the clearest integration point.
- Typical cases are wrapper-style exports or an existing component boundary that you cannot remove in the same change.
- Do not default to HOCs for new code when `useFaas` or `FaasDataWrapper` is simpler.

Example:

```tsx
import { withFaasData } from '@faasjs/react'

export const UserName = withFaasData(
  ({ data, error, reload }) =>
    error ? (
      <button type="button" onClick={() => reload()}>
        Retry
      </button>
    ) : (
      <span>{data.name}</span>
    ),
  {
    action: '/pages/users/get',
    params: { id: 1 },
  },
)
```

### 6. Keep `FaasReactClient` setup centralized

- Create and register the browser client configuration once at app setup.
- Use `onError` to collect or report request errors in one place.
- Avoid creating ad hoc clients deep in the component tree.

Example:

```ts
import { FaasReactClient, ResponseError } from '@faasjs/react'

FaasReactClient({
  baseUrl: '/api/',
  onError: (action, params) => async (error) => {
    if (error instanceof ResponseError) {
      reportErrorToSentry(error, {
        tags: { action },
        extra: { params },
      })
    }
  },
})
```

### 7. Use `getClient` only for multiple-client scenarios

- `getClient` is for special cases such as multiple Faas clients with different base URLs.
- Do not reach for `getClient` in normal single-client app code.

Example:

```ts
import { FaasReactClient, getClient } from '@faasjs/react'

FaasReactClient({
  baseUrl: 'https://service-a.example.com/api/',
})

FaasReactClient({
  baseUrl: 'https://service-b.example.com/api/',
})

const client = getClient('https://service-b.example.com/api/')
```

## Review Checklist

- each request chooses the smallest fitting API: `useFaas`, `useFaasStream`, `faas`, `FaasDataWrapper`, or `withFaasData`
- loading, error, and retry states are handled explicitly
- action paths follow the file-conventions guide and use `/pages/...` mapping
- wrapper-based request composition is used only when it improves structure
- `FaasReactClient` setup stays centralized
- `getClient` is used only for special multiple-client scenarios

## Read Next

- [React Guide](./react.md)
- [React Testing Guide](./react-testing.md)
- [useFaas](/doc/react/functions/useFaas.html)
- [useFaasStream](/doc/react/functions/useFaasStream.html)
- [faas](/doc/react/functions/faas.html)
- [FaasDataWrapper](/doc/react/variables/FaasDataWrapper.html)
- [withFaasData](/doc/react/functions/withFaasData.html)
- [FaasReactClient](/doc/react/functions/FaasReactClient.html)
- [getClient](/doc/react/functions/getClient.html)
