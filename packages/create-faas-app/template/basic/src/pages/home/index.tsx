import { useState } from 'react'

import { faas } from '../../react-client'

type HelloResponse = {
  message?: string
}

export default function HomePage() {
  const [name, setName] = useState('FaasJS')
  const [message, setMessage] = useState('Click button to call API')
  const [loading, setLoading] = useState(false)

  const callApi = async () => {
    setLoading(true)

    try {
      const response = await faas('/pages/home/api/hello', {
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
    <main style={{ margin: '5rem auto', maxWidth: 420, padding: 24 }}>
      <h1>FaasJS App</h1>
      <p>{message}</p>

      <label style={{ display: 'block', marginBottom: 12 }}>
        Name:
        <input
          style={{ marginLeft: 8 }}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      <button type="button" onClick={callApi} disabled={loading}>
        {loading ? 'Loading...' : 'Call /pages/home/api/hello'}
      </button>
    </main>
  )
}
