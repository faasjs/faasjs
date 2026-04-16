# React Testing Guide

Use this guide when writing or reviewing React tests that exercise FaasJS request flows in hooks or components.

Apply the shared [Testing Guide](./testing.md) first, then use the React-specific rules below.

For pure presentational components or hooks that do not touch FaasJS request flows, follow the shared [Testing Guide](./testing.md) and [React Guide](./react.md) instead.

## Use This Guide When

- testing hooks that issue FaasJS requests
- testing components that call FaasJS requests
- deciding how to use `setMock` for request-related React tests
- setting up shared request-mock cleanup in Vitest
- choosing between hook tests and component tests for request flows

## Default Workflow

1. Start with the shared [Testing Guide](./testing.md).
2. Name React hook and component tests that require `jsdom` with `.ui.test.ts` or `.ui.test.tsx`.
3. Clear the global mock in shared Vitest setup with `afterEach(() => setMock(null))`.
4. Set the specific mock for each test or `beforeEach`.
5. Prefer request-layer mocks such as `setMock` over mocking local hooks, functions, or components.
6. Test observable behavior instead of implementation details.
7. Cover loading, error, reload, skip, debounce, and controlled-props behavior when those flows exist.
8. Use hook tests for hook behavior and component tests for visible UI behavior.

## Rules

### 1. Use `setMock` instead of real network requests

- React unit tests that cover `@faasjs/react` request flows should use `setMock`.
- Do not rely on external services, real fetch timing, or environment-specific backends in unit tests.
- Keep mock setup explicit and local to the test scenario.
- When a test needs `@testing-library/react`, `renderHook`, `window`, or other `jsdom` APIs, name it with `.ui.test.ts` or `.ui.test.tsx` so Vitest can route it to the `jsdom` project without relying on package location.

Vitest setup example:

```ts
import { afterEach } from 'vitest'

import { setMock } from '@faasjs/react'

afterEach(() => {
  setMock(null)
})
```

### 2. Start with the smallest mock that fits the scenario

- Use a static object when one response is enough.
- Use a handler when the response depends on path or params.
- Use a streaming mock only when the code under test actually reads a stream.
- Prefer `stringToStream` as a helper for simple text-stream scenarios so the test setup stays compact.

Basic examples:

```ts
import { setMock } from '@faasjs/react'

setMock({
  data: {
    name: 'FaasJS',
  },
})

setMock({
  status: 500,
  data: {
    message: 'Internal Server Error',
  },
})
```

Handler examples:

```ts
import { setMock } from '@faasjs/react'

setMock(async () => ({
  data: {
    name: 'FaasJS',
  },
}))

setMock(async (path) => {
  if (path === '/pages/users/get') {
    return {
      data: {
        id: 1,
        name: 'FaasJS',
      },
    }
  }

  if (path === '/pages/posts/get') {
    return {
      data: {
        id: 2,
        title: 'Hello',
      },
    }
  }

  return {
    status: 404,
    data: {
      message: 'Not Found',
    },
  }
})

setMock(async (path, params) => {
  if (path === '/pages/users/get' && params.id === 1) {
    return {
      data: {
        id: 1,
        name: 'Admin',
      },
    }
  }

  if (path === '/pages/users/get' && params.id === 2) {
    return {
      data: {
        id: 2,
        name: 'Editor',
      },
    }
  }

  return {
    status: 404,
    data: {
      message: 'User not found',
    },
  }
})
```

Streaming example:

```ts
import { stringToStream } from '@faasjs/utils'
import { setMock } from '@faasjs/react'

setMock({
  body: stringToStream('hello world'),
})
```

### 3. Keep mock boundaries at the request layer when possible

- Follow the shared [Testing Guide](./testing.md) rule against unnecessary mocks.
- When React request behavior can be exercised through `setMock`, prefer that over mocking local hooks, components, or helpers.
- Keep child components and local helpers real unless a clear external boundary forces isolation.
- Use `setMock` to model the request contract, not to recreate component internals.

### 4. Add focused component tests for visible behavior

- Prefer `@testing-library/react` for component tests.
- Assert what users can see or trigger.
- Cover success and failure states when the component owns a request.

Example:

```tsx
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { setMock, useFaas } from '@faasjs/react'

function UserName() {
  const { data } = useFaas<{ name: string }>('/pages/users/get', {})

  return <div>{data?.name}</div>
}

describe('UserName', () => {
  beforeEach(() => {
    setMock(async () => ({
      data: {
        name: 'FaasJS',
      },
    }))
  })

  it('renders mocked data', async () => {
    render(<UserName />)

    expect(await screen.findByText('FaasJS')).toBeDefined()
  })
})
```

### 5. Add focused hook tests for hook behavior

- Prefer `renderHook` when the behavior can be verified without rendering a full UI.
- Cover behavior such as reload, skip, debounce, loading, error, and controlled props when relevant.
- When adding or changing mock-based request logic, include tests that prove the expected `setMock` interaction path.

Example:

```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { setMock, useFaas } from '@faasjs/react'

describe('useFaas', () => {
  beforeEach(() => {
    setMock(async (_path, params) => ({
      data: params,
    }))
  })

  it('supports reload with next params', async () => {
    const { result } = renderHook(() => useFaas<{ id: number }>('/pages/users/get', { id: 1 }))

    await waitFor(() => expect(result.current.data).toEqual({ id: 1 }))

    await result.current.reload({ id: 2 })

    await waitFor(() => expect(result.current.data).toEqual({ id: 2 }))
  })
})
```

## Review Checklist

- shared [Testing Guide](./testing.md) rules are followed first
- tests that require `jsdom` use the `.ui.test.ts` or `.ui.test.tsx` suffix
- request-related tests use `setMock` instead of real network calls
- shared Vitest setup clears mocks with `setMock(null)`
- mocks are no more complex than the scenario requires
- request tests keep mock boundaries at `setMock` or another explicit external boundary when possible
- components are tested through visible behavior
- hooks are tested through `renderHook` when appropriate
- tests cover relevant loading, error, reload, skip, debounce, or controlled-props flows

## Read Next

- [Testing Guide](./testing.md)
- [React Guide](./react.md)
- [React Data Fetching Guide](./react-data-fetching.md)
- [setMock](/doc/react/functions/setMock.html)
- [useFaas](/doc/react/functions/useFaas.html)
- [useFaasStream](/doc/react/functions/useFaasStream.html)
