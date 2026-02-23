import { defineApi, HttpError, z } from '@faasjs/core'

const schema = z
  .object({
    title: z.string().min(1),
    price: z.number().positive(),
    quantity: z.number().int().positive().default(1),
  })
  .required()

export const func = defineApi({
  schema,
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
