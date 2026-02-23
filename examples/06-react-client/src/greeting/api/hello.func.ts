import { defineApi, z } from '@faasjs/core'

const schema = z
  .object({
    name: z.string().optional(),
  })

export const func = defineApi({
  schema,
  async handler({ params }) {
    return {
      message: `Hello, ${params.name || 'FaasJS'}!`,
    }
  },
})
