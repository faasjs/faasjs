import { HttpError } from '@faasjs/core'

import { useMiddleware } from '../../../middleware'

export default useMiddleware(function handle() {
  throw new HttpError({
    statusCode: 500,
    message: 'business-500',
  })
})
