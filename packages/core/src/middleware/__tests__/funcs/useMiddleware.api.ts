import { useMiddleware } from '../../../middleware'

export default useMiddleware(function handle(_, response) {
  response.end('useMiddleware')
})
