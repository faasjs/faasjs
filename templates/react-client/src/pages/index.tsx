import App from '../App'
import { getHomePageState } from '../routing/route-data'

export default function HomePage() {
  return <App {...getHomePageState()} />
}
