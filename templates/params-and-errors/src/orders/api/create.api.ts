import { defineApi, HttpError, z } from '@faasjs/core'

export default defineApi({
  schema: z
    .object({
      title: z.string().min(1),
      price: z.number().positive(),
      quantity: z.number().int().positive().default(1),
    })
    .required(),
  async handler({ params }) {
    if (params.title === 'duplicate') {
      throw new HttpError({
        statusCode: 409,
        message: 'Order title already exists',
      })
    }

    if (params.title === 'explode') throw Error('Unexpected failure')

    return {
      id: 'demo-order',
      title: params.title,
      total: params.price * params.quantity,
    }
  },
})
