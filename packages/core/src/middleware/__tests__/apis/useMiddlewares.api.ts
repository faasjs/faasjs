import { useMiddlewares } from '@faasjs/core'

export default useMiddlewares([
  function handle(_, response) {
    response.end('useMiddlewares')
  },
])
