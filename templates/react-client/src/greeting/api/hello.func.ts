import { defineApi, z } from '@faasjs/core'

import { createGreeting } from '../createGreeting'

export const func = defineApi({
  schema: z.object({
    name: z.string().min(1).optional(),
  }),
  async handler({ params }) {
    return createGreeting(params.name || 'FaasJS')
  },
})
