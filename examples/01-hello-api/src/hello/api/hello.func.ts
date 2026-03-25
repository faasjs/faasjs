import { defineApi, z } from '@faasjs/core'

export const func = defineApi({
  schema: z.object({
    name: z.string().min(1).optional(),
  }),
  async handler(data) {
    data
    return {
      message: `Hello, ${data.params.name || 'FaasJS'}!`,
    }
  },
})
