import { HttpError } from '@faasjs/http'
import { useMiddleware } from '../../../middleware'

export const func = useMiddleware(function handle() {
  throw new HttpError({
    statusCode: 500,
    message: 'business-500',
  })
})
