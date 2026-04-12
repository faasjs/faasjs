import type { PageLoaderContext } from '@faasjs/react/routing'

import App from '../App'
import { createGreeting } from '../greeting/createGreeting'

type HomePageProps = {
  initialName: string
  initialMessage: string
}

export async function loader({ query }: PageLoaderContext) {
  const rawName = query.name
  const initialName = (Array.isArray(rawName) ? rawName[0] : rawName)?.trim() || 'FaasJS'

  return {
    props: {
      initialName,
      initialMessage: createGreeting(initialName).message,
    },
  }
}

export default function HomePage(props: HomePageProps) {
  return <App {...props} />
}
