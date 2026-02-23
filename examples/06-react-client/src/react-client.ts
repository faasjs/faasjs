import { FaasReactClient } from '@faasjs/react'

const client = FaasReactClient({
  baseUrl: '/',
})

export const faas = client.faas
export const useFaas = client.useFaas
