import type { PageLoaderContext } from '@faasjs/react/auto-pages'

type DocsFallbackPageProps = {
  restPath: string
}

export async function loader({ restPath }: Pick<PageLoaderContext, 'restPath'>) {
  return {
    props: {
      restPath: restPath || '/',
    },
  }
}

export default function DocsFallbackPage(props: DocsFallbackPageProps) {
  return (
    <main style={{ margin: '4rem auto', maxWidth: 720, padding: 20, lineHeight: 1.7 }}>
      <h1>Docs Fallback Page</h1>
      <p>
        This route is served by <code>src/pages/docs/default.tsx</code>.
      </p>
      <p>
        Unmatched docs path: <code>{props.restPath}</code>
      </p>
      <p>
        Try <a href="/">home</a> or a deeper path like <a href="/docs/react/ssr">/docs/react/ssr</a>
        .
      </p>
    </main>
  )
}
