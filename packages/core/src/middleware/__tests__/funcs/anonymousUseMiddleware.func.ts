import { useMiddleware } from '../../../middleware'

export const func = useMiddleware((_, response) => {
  response.end('anonymousUseMiddleware')
})
