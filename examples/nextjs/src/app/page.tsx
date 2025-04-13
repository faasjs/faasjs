'use client'
import { useFaas } from '@faasjs/react'
import { useState } from 'react'
import { now } from './now.action'

export default function Home() {
  const [type, setType] = useState('toString')
  const { data, error } = useFaas(now, { type })

  console.log('error', error)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <h1>FaasJS Example for Next.js</h1>
      <p>Now: {data}</p>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      <button
        type='button'
        onClick={() => {
          setType('toString')
        }}
      >
        toString
      </button>
      <button
        type='button'
        onClick={() => {
          setType('toISOString')
        }}
      >
        toISOString
      </button>
      <button
        type='button'
        onClick={() => {
          setType('toTimestamp')
        }}
      >
        toTimestamp
      </button>
      <button
        type='button'
        onClick={() => {
          setType('throw Error')
        }}
      >
        throw Error
      </button>
    </div>
  )
}
