import { Func } from '@faasjs/core'
import { HttpError } from '@faasjs/core'

export default new Func({
  async handler() {
    throw new HttpError({
      statusCode: 500,
      message: 'business-500',
    })
  },
})
