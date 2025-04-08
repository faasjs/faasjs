import { useMiddleware } from '../../../middleware'

export const func = useMiddleware(function handle(_, response) {
  response.end('useMiddleware')
})
