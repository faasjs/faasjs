import { useMiddleware } from '../../../middleware'

export default useMiddleware((_, response) => {
  response.end('useMiddleware')
})
