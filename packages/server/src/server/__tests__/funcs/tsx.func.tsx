import { Func } from '@faasjs/func'
import { Http } from '@faasjs/http'
import { renderToString } from 'react-dom/server'

const http = new Http()

function App() {
  return <h1>Hi</h1>
}

export const func = new Func({
  plugins: [http],
  async handler() {
    http.setContentType('html')
    http.setBody(renderToString(<App />))
  },
})
