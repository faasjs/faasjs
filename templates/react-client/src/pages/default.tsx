import type { PageLoaderContext } from '@faasjs/react/auto-pages'

type NotFoundPageProps = {
  pathname: string
}

export async function loader({ pathname }: PageLoaderContext) {
  return {
    statusCode: 404,
    props: {
      pathname,
    },
  }
}

export default function NotFoundPage(props: NotFoundPageProps) {
  return (
    <main style={{ margin: '4rem auto', maxWidth: 720, padding: 20, lineHeight: 1.7 }}>
      <h1>Page Not Found</h1>
      <p>
        No exact page matched <code>{props.pathname}</code>, so the root fallback page handled it.
      </p>
      <p>
        Go back to <a href="/">home</a> or try the docs fallback at{' '}
        <a href="/docs/react/ssr">/docs/react/ssr</a>.
      </p>
    </main>
  )
}
