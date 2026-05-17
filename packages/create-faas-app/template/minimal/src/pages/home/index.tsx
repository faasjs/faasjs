declare module '@faasjs/types' {
  interface FaasActions {
    '/pages/home/api/hello': {
      Params: { name?: string | undefined }
      Data: { message?: string }
    }
  }
}

import { useState } from 'react'

import { useFaas } from '../../react-client'

export default function HomePage() {
  const [name, setName] = useState('FaasJS')

  const { data, loading, reload } = useFaas(
    '/pages/home/api/hello',
    { name: name.trim() || undefined },
    { skip: true },
  )

  return (
    <main style={{ margin: '5rem auto', maxWidth: 420, padding: 24 }}>
      <h1>FaasJS Minimal App</h1>
      <p>{data?.message || 'Click button to call API'}</p>

      <label style={{ display: 'block', marginBottom: 12 }}>
        Name:
        <input
          style={{ marginLeft: 8 }}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      <button
        type="button"
        onClick={() => reload({ name: name.trim() || undefined })}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Call /pages/home/api/hello'}
      </button>
    </main>
  )
}
