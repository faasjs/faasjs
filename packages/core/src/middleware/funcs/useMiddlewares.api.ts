import { useMiddlewares } from '../../middleware'

export default useMiddlewares([
  function handle(_, response) {
    response.end('useMiddlewares')
  },
])
