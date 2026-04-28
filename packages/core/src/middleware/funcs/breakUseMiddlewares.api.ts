import { useMiddlewares } from '../../middleware'

export default useMiddlewares([
  function first(_, response) {
    response.end('breakUseMiddlewares')
  },
  function second(_, response) {
    response.setHeader('x-should-not-run', '1')
  },
])
