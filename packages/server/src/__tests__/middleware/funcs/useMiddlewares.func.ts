import { useMiddlewares } from '../../../middleware'

export const func = useMiddlewares([
  function handle(_, response) {
    response.end('useMiddlewares')
  },
])
