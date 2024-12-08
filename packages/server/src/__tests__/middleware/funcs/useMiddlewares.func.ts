import { useMiddlewares } from '../../../middleware'

export default useMiddlewares([
  (_, response) => {
    response.end('useMiddlewares')
  },
])
