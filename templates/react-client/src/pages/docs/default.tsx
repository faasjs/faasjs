import { getDocsRestPath } from '../../routing/route-data'

export default function DocsFallbackPage() {
  const restPath = getDocsRestPath()

  return (
    <main style={{ margin: '4rem auto', maxWidth: 720, padding: 20, lineHeight: 1.7 }}>
      <h1>Docs Fallback Page</h1>
      <p>
        This route is served by <code>src/pages/docs/default.tsx</code>.
      </p>
      <p>
        Unmatched docs path: <code>{restPath}</code>
      </p>
      <p>
        Try <a href="/">home</a> or a deeper path like{' '}
        <a href="/docs/react/routing">/docs/react/routing</a>.
      </p>
    </main>
  )
}
