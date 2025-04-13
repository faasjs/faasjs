'use server'

import { useFaasAction } from '@/utils/useFaasAction'

export const now = useFaasAction(async ({ params }) => {
  switch (params.type) {
    case 'toString':
      return new Date().toString()
    case 'toTimestamp':
      return new Date().getTime()
    case 'toISOString':
      return new Date().toISOString()
    default:
      throw Error('Invalid type')
  }
})
