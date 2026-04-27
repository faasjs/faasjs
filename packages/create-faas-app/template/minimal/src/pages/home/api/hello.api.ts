import { defineApi } from '@faasjs/core'
import * as z from 'zod'

export default defineApi({
  schema: z.object({
    name: z.string().min(1).optional(),
  }),
  async handler({ params }) {
    return {
      message: `Hello, ${params.name || 'FaasJS'}!`,
    }
  },
})
