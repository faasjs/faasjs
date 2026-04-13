import { getCurrentPathname } from '../routing/route-data'

export default function NotFoundPage() {
  const pathname = getCurrentPathname()

  return (
    <main style={{ margin: '4rem auto', maxWidth: 720, padding: 20, lineHeight: 1.7 }}>
      <h1>Page Not Found</h1>
      <p>
        No exact page matched <code>{pathname}</code>, so the root fallback page handled it.
      </p>
      <p>
        Go back to <a href="/">home</a> or try the docs fallback at{' '}
        <a href="/docs/react/routing">/docs/react/routing</a>.
      </p>
    </main>
  )
}
