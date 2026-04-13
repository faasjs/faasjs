import { faas } from '@faasjs/react'
import { useState } from 'react'

import { createGreeting } from './greeting/createGreeting'

type AppProps = {
  initialName: string
  initialMessage: string
}

type HelloResponse = {
  message?: string
}

export default function App(props: AppProps) {
  const initialName = props.initialName || 'FaasJS'
  const initialMessage = props.initialMessage || createGreeting(initialName).message

  const [name, setName] = useState(initialName)
  const [message, setMessage] = useState(initialMessage)
  const [loading, setLoading] = useState(false)

  const callApi = async () => {
    setLoading(true)

    try {
      const response = await faas('greeting/api/hello', {
        name: name.trim() || undefined,
      })

      const data = response.data as HelloResponse | undefined

      setMessage(data?.message || 'Empty response')
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ margin: '4rem auto', maxWidth: 480, padding: 20, lineHeight: 1.6 }}>
      <h1>FaasJS React Routing Example</h1>
      <p>{message}</p>
      <p>
        This page is discovered from <code>src/pages/index.tsx</code> and reads the current URL on
        the client.
      </p>
      <p>
        Try <a href="/?name=React">/?name=React</a>,{' '}
        <a href="/docs/react/routing">/docs/react/routing</a>, or <a href="/missing">/missing</a>.
      </p>

      <label style={{ display: 'block', marginBottom: 12 }}>
        Name:
        <input
          style={{ marginLeft: 8 }}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      <button type="button" onClick={callApi} disabled={loading}>
        {loading ? 'Loading...' : 'Call /greeting/api/hello'}
      </button>
    </main>
  )
}
